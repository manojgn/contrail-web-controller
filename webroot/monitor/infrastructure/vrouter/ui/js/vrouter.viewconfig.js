/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define(['underscore', 'contrail-view','contrail-list-model', 'cf-datasource', 'legend-view', 'monitor-infra-vrouter-model', 'node-color-mapping'],
        function(_, ContrailView, ContrailListModel, CFDataSource, LegendView, VRouterListModel, NodeColorMapping){
    var VRouterViewConfig = function () {
        var self = this;
//        var nodeColorMapping = new NodeColorMapping();
//        var colorFn = nodeColorMapping.getNodeColorMap;
        var vRouterListModel = new VRouterListModel();
        self.vRouterListModel = vRouterListModel;
        //ListModel that is kept in sync with crossFilter
        var vRouterUIListModel = new ContrailListModel({data:[]});
        var cfDataSource = new CFDataSource();
        self.cfDataSource = cfDataSource;
        //vRouterListModel -> crossFilter(optional) & vRouterUIListModel
        //crossFilter -> vRouterListModel
        //Update cfDataSource on vRouterListModel update

        if(cfDataSource.getDimension('gridFilter') == null) {
            cfDataSource.addDimension('gridFilter',function(d) {
                return d['name'];
            });
        }
        if(cfDataSource.getDimension('colorFilter') == null) {
            cfDataSource.addDimension('colorFilter',function(d) {
                return d['color'];
            });
        }
        function onUpdatevRouterListModel() {
            cfDataSource.updateData(vRouterListModel.getItems());

            cfDataSource.fireCallBacks({source:'fetch'});
        }

        function onUpdatevRouterUIListModel() {
            if(vRouterUIListModel.updateFromcrossFilter != true) {
                var selRecords = vRouterUIListModel.getFilteredItems();
                var selIds = $.map(selRecords,function(obj,idx) {
                    return obj.name;
                });

                self.vRouterListModel.updateFromUIListModel = true;
                //Apply filter only if filteredRows is < totalRows else remove the filter
                if(vRouterUIListModel.getFilteredItems().length < vRouterUIListModel.getItems().length) {
                    cfDataSource.applyFilter('gridFilter',function(d) {
                        return $.inArray(d,selIds) > -1;
                    });
                    cfDataSource.fireCallBacks({source:'grid'});
                } else {
                    //Remove if an earlier filter exists
                    if(cfDataSource.getFilter('gridFilter') != null) {
                        cfDataSource.removeFilter('gridFilter');
                        cfDataSource.fireCallBacks({source:'grid'});
                    }
                }
            } else {
                vRouterUIListModel.updateFromcrossFilter = false;
            }
        }

        //As cfDataSource is core one,triggered whenever filters applied/removed
        //If udpate is triggered from
        //  1. vRouterListModel, update both crossfilter & grid
        //  2. crossfilter, update grid
        //  3. grid, update crossfilter
        cfDataSource.addCallBack('updateCFListModel',function(data) {
            vRouterUIListModel.updateFromcrossFilter = false;
            //Update listUIModel with crossfilter data
            if(data['cfg']['source'] != 'grid') {
                //Need to get the data after filtering from dimensions other than gridFilter
                var currGridFilter = cfDataSource.removeFilter('gridFilter');
                vRouterUIListModel.setData(cfDataSource.getDimension('gridFilter').top(Infinity).sort(dashboardUtils.sortNodesByColor));
                if(currGridFilter != null) {
                    cfDataSource.applyFilter('gridFilter',currGridFilter);
                }
            }
            if(data['cfg']['source'] == 'crossFilter')
                vRouterUIListModel.updateFromcrossFilter = true;
        });

        self.viewConfig = {
             "vrouter-flow-rate-area-chart" :  function (){
              return   {
                    modelCfg: monitorInfraUtils.getStatsModelConfig({
                        table_name: 'StatTable.VrouterStatsAgent.flow_rate',
                        select: 'T=, SUM(flow_rate.active_flows)'
                    },
                    {
                        table_name: 'StatTable.VrouterStatsAgent.drop_stats',
                        select: 'T=, SUM(drop_stats.__value)',
                        mergeFn: monitorInfraUtils.parseAndMergeStats
                    }),
                    viewCfg: {
                        elementId : 'flow_rate_area_chart_section',
                        view : "SectionView",
                        viewConfig : {
                            rows : [ {
                                columns :[
                                     $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
                                         elementId : 'flow_rate_area_chart',
                                         viewConfig: {
                                             chartOptions: {
                                                 title: 'Active Flows',
                                                 xAxisLabel: '',
                                                 yAxisLabel: 'Active Flows',
                                                 yField: 'SUM(flow_rate.active_flows)',
                                             }
                                         }
                                     })
                                ]
                            }]
                        }
                    },
                    itemAttr: {
                        height: 1,
                        width:0.7
                    }
                }
             },
             "vrouter-cpu-mem-scatter-chart" : function(){
                 return {
                     modelCfg: vRouterListModel,
                     viewCfg: $.extend(true, {}, monitorInfraUtils.defaultScatterChartViewCfg, {
                         elementId : 'vrouter-cpu-mem-chart',
                         viewConfig: {
                             chartOptions: {
                                 xTickCount: 3
//                                 cfDataSource : self.cfDataSource
                             },
//                             cfDataSource : self.cfDataSource,
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.4
                     }
                 }
             },
             "vrouter-bandwidth-percentile-chart" : function() {
                 return {
                     modelCfg: monitorInfraUtils.getStatsModelConfig([
                    {
                      table_name: 'StatTable.VrouterStatsAgent.phy_band_in_bps',
                      select: 'T=, PERCENTILES(phy_band_in_bps.__value)'
                    },
                    {
                      table_name: 'StatTable.VrouterStatsAgent.phy_band_out_bps',
                      select: 'T=, PERCENTILES(phy_band_out_bps.__value)',
                      mergeFn: monitorInfraUtils.parseAndMergeStats
                    }
//                    {
//                        table_name :'StatTable.NodeStatus.disk_usage_info',
//                        select:'T=, PERCENTILES(disk_usage_info.partition_space_used_1k)'
//                    }
                    ]),
                    viewCfg: $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
                      elementId : 'band-in-out-chart',
                      viewConfig: {
                          parseFn : cowu.parsePercentilesData,
                    //      parseFn : function(data, chartOptions) {
                    //          var data = cowu.parsePercentilesDataForStack(data,chartOptions);
                    //          return cowu.chartDataFormatter(data, chartOptions);
                    //      },
                          chartOptions: {
                              colors:cowc.THREE_NODE_COLOR,
                              title: 'Bandwidth In/Out 95th Percentile',
                              xAxisLabel: '',
                              yAxisLabel: 'Bandwidth In/Out',
                              yFormatter: function(y) {
                                  return y;
                              },
                    //          yField: 'percentileValue',
                    //          groupBy:'Source',
                              yFields: ['PERCENTILES(phy_band_in_bps.__value)','PERCENTILES(phy_band_out_bps.__value']
//                              yFields:getYFieldsForPercentile('disk_usage_info.partition_space_used_1k')
                          }
                      }
                    }),
                    itemAttr: {
                      height: 1,
                      width:0.4
                    }
                 }
             },
             "vrouter-system-cpu-percentiles-chart" : function() {
                 return {
                     modelCfg: monitorInfraUtils.getStatsModelConfig({
                         table_name: 'StatTable.NodeStatus.system_mem_cpu_usage',
                         select: 'T=, PERCENTILES(system_mem_cpu_usage.cpu_share)'
                     }),
                     viewCfg: $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
//                         view:"StackedAreaChartView",
                         elementId : 'system-cpu-chart',
                         viewConfig: {
                             parseFn : cowu.parsePercentilesData,
//                             parseFn : function(data, chartOptions) {
//                                 var data = cowu.parsePercentilesDataForStack(data,chartOptions);
//                                 return cowu.chartDataFormatter(data, chartOptions);
//                             },
                             chartOptions: {
                                 title: 'System CPU Share (%) Percentiles',
                                 xAxisLabel: '',
//                                 yField: 'percentileValue',
                                 yAxisLabel: 'System CPU Share (%)',
//                                 groupBy:'Source',
                                 yFields: getYFieldsForPercentile('system_mem_cpu_usage.cpu_share')
                             }
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.4
                     }
                 }
             },
             "vrouter-system-memory-percentiles-chart" : function() {
                 return {
                     modelCfg: monitorInfraUtils.getStatsModelConfig({
                         table_name: 'StatTable.ComputeCpuState.cpu_info',
                         select: 'T=, PERCENTILES(cpu_info.used_sys_mem)'
                     }),
                     viewCfg: $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
//                         view:"StackedAreaChartView",
                         elementId : 'system-memory-chart',
                         viewConfig: {
                             parseFn : cowu.parsePercentilesData,
//                             parseFn : function(data, chartOptions) {
//                                 var data = cowu.parsePercentilesDataForStack(data,chartOptions);
//                                 return cowu.chartDataFormatter(data, chartOptions);
//                             },
                             chartOptions: {
                                 title: 'System Memory Used Percentiles',
                                 xAxisLabel: '',
                                 yAxisLabel: 'System Memory Used',
//                                 groupBy:'Source',
//                                 yField: 'percentileValue',
                                 yFields: getYFieldsForPercentile('cpu_info.used_sys_mem'),
                                 yFormatter: function(y) {
                                     return formatBytes(y * 1024, true, null, null,
                                             null);
                                 }
                             }
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.4
                     }
                 }
             },
             "vrouter-summary-grid" : function() {
                 return {
                     modelCfg: vRouterListModel,
                     viewCfg: {
                         elementId: ctwl.VROUTER_SUMMARY_GRID_ID,
                         title: ctwl.VROUTER_SUMMARY_TITLE,
                         view: "VRouterSummaryGridView",
                         viewPathPrefix: ctwl.VROUTER_VIEWPATH_PREFIX,
                         app: cowc.APP_CONTRAIL_CONTROLLER,
                         viewConfig: {
                             colorFn: {}
                         }
                     }
                 }
             },
             "vrouter-crossfilters-chart" : function() {
                 return {
                     modelCfg: vRouterUIListModel,
                     viewCfg: {
                         elementId: ctwl.VROUTER_SUMMARY_CROSSFILTER_ID,
                         title: ctwl.VROUTER_SUMMARY_TITLE,
                         view: "VRouterCrossFiltersView",
                         viewPathPrefix: ctwl.VROUTER_VIEWPATH_PREFIX,
                         app: cowc.APP_CONTRAIL_CONTROLLER,
                         viewConfig: {
                             vRouterListModel:self.vRouterListModel,
//                             vRouterListModel : new vRouterListModel(),
                             cfDataSource: self.cfDataSource,
                             config:[{
                                 field:'vnCnt',
                                 title:'vRouters over Virtual Networks'
                             },
                             {
                                 field:'instCnt',
                                 title:'vRouters over Instances'
                             },{
                                 field:'intfCnt',
                                 title:'vRouters over Interfaces'
                             }
                             ]
                         }
                     },itemAttr: {
                         height: 0.5,
//                         width:0.4
                     }
                 }
             },
             "vrouter-system-cpu-mem-chart" : function() {
                 return {
                     modelCfg: vRouterListModel,
                     viewCfg: $.extend(true, {}, monitorInfraUtils.defaultScatterChartViewCfg, {
                         elementId : 'vrouter-system-cpu-mem-chart',
                         viewConfig: {
                 //            cfDataSource : self.cfDataSource,
                             chartOptions: {
                                 xField: 'NodeStatus;system_mem_cpu_usage;cpu_share',
                                 xFormatter: function(x) {return $.isNumeric(x) ? x : NaN;},
                                 xLabelFormat: function(x) {return $.isNumeric(x) ? x : NaN;},
                                 yField: 'NodeStatus;system_mem_cpu_usage;mem_info;used',
                                 yFormatter: function(y) {
                                                 return $.isNumeric(y) ? parseFloat(
                                                 parseFloat(y / 1024).toFixed(2)) : NaN;
                                             },
                                 yLabelFormat: function(y) {
                                     return $.isNumeric(y) ? parseFloat(
                                     parseFloat(y / 1024/ 1024).toFixed(2)) : NaN;
                                 },
                                 xLabel: 'System CPU Share (%)',
                                 yLabel: 'System Memory (GB)',
                                 sizeField: 'size',
                                 tooltipConfigCB: function(currObj,format) {
                                     var options = {};
                                     options['tooltipContents'] = [
                                           {label:'Host Name', value: currObj['name']},
                                           {label:'Version', value:currObj['version']},
                                           {label: 'System CPU Share (%)', value:getValueByJsonPath(currObj,'NodeStatus;system_mem_cpu_usage;cpu_share','-')},
                                           {label: 'System Memory (GB)', value:function(){
                                                   var mem = getValueByJsonPath(currObj,'NodeStatus;system_mem_cpu_usage;mem_info;used','-');
                                                   mem = $.isNumeric(mem) ? parseFloat(
                                                           parseFloat(mem / 1024).toFixed(2)) : NaN;
                                                   return formatBytes(mem * 1024 * 1024);
                                               }()
                                           },
                                           {label: 'Virtual Networks', value:currObj['vnCnt']},
                                           {label: 'Instances', value:currObj['instCnt']},
                                           {label: 'Interfaces', value:currObj['intfCnt']}
                                       ];
                                     return monitorInfraUtils.getVRouterScatterChartTooltipFn(currObj,format,options);
                                 },
                                 clickCB: monitorInfraUtils.onvRouterDrillDown,
                 //                cfDataSource : self.cfDataSource
                             }
                         }
                     }),
                 itemAttr: {
                         height: 1,
                         width:0.5
                     }
                 }
             },
             "vrouter-vn-int-inst-chart" : function() {
                 return {
                     modelCfg: vRouterListModel,
                     viewCfg: $.extend(true, {}, monitorInfraUtils.defaultScatterChartViewCfg, {
                         elementId : 'vrouter-vn-int-chart',
                         viewConfig: {
                             chartOptions: {
                                 xField: 'vnCnt',
                                 yField: 'instCnt',
                                 xLabel: 'Virtual Networks',
                                 yLabel: 'Instances',
                                 sizeFieldName : 'intfCnt',
                                 tooltipConfigCB: function(currObj,format) {
                                     var options = {};
                                     options['tooltipContents'] = [
                                           {label:'Host Name', value: currObj['name']},
                                           {label:'Version', value:currObj['version']},
                                           {label: 'Virtual Networks', value:currObj['vnCnt']},
                                           {label: 'Instances', value:currObj['instCnt']},
                                           {label: 'Interfaces', value:currObj['intfCnt']}
                                       ];
                                     return monitorInfraUtils.getVRouterScatterChartTooltipFn(currObj,format,options);
                                 },
                                 clickCB: monitorInfraUtils.onvRouterDrillDown
                             }
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.5
                     }
                 }
             },
             "vrouter-agent-cpu-percentiles-chart" : function() {
                 return {
                     modelCfg: monitorInfraUtils.getStatsModelConfig({
                         table_name: 'StatTable.ComputeCpuState.cpu_info',
                         select: 'T=, PERCENTILES(cpu_info.cpu_share)'
                     }),
                     viewCfg: $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
                         elementId : 'agent-cpu-share-chart',
                         viewConfig: {
                             parseFn : cowu.parsePercentilesData,
                             chartOptions: {
                                 title: 'VRouter Agent CPU (%) Percentiles',
                                 xAxisLabel: '',
                                 yAxisLabel: 'VRouter Agent CPU Share (%)',
                                 yFields: getYFieldsForPercentile('cpu_info.cpu_share'),
                                 yFormatter: function(y) {
                                     return y;
                                 }
                             }
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.4
                     }
                 }
             },
             "vrouter-agent-mem-usage-percentiles-chart" : function() {
                 return {
                     modelCfg: monitorInfraUtils.getStatsModelConfig({
                         table_name: 'StatTable.ComputeCpuState.cpu_info',
                         select: 'T=, PERCENTILES(cpu_info.mem_res)'
                     }),
                     viewCfg: $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
                         elementId : 'agent-memory-chart',
                         viewConfig: {
                             parseFn : cowu.parsePercentilesData,
                             chartOptions: {
                                 title: 'VRouter Agent Memory Usage Percentiles',
                                 xAxisLabel: '',
                                 yAxisLabel: 'VRouter Agent Memory Usage',
                                 yFields: getYFieldsForPercentile('cpu_info.mem_res'),
                                 yFormatter: function(y) {
                                     return formatBytes(y * 1024, true, null, null,
                                             null);
                                 }
                             }
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.4
                     }
                 }
             },
             "vrouter-active-flows-percentiles-chart" : function() {
                 return {
                     modelCfg: monitorInfraUtils.getStatsModelConfig({
                         table_name: 'StatTable.VrouterStatsAgent.flow_rate',
                         select: 'T=, PERCENTILES(flow_rate.active_flows)'
                     }),
                     viewCfg: $.extend(true, {}, monitorInfraConstants.defaultLineChartViewCfg, {
                         elementId : 'active-flows-chart',
                         viewConfig: {
                             parseFn : cowu.parsePercentilesData,
                             chartOptions: {
                                 title: 'Active Flows Percentiles',
                                 xAxisLabel: '',
                                 yAxisLabel: 'Active Flows',
                                 yFields: getYFieldsForPercentile('flow_rate.active_flows')
                             }
                         }
                     }),
                     itemAttr: {
                         height: 1,
                         width:0.4
                     }
                 }
             }
        }
        self.getViewConfig = function(id) {
            return self.viewConfig[id]();
        };
        function getYFieldsForPercentile (field) {
            return [
                        'PERCENTILES('+field+');95',
                        'PERCENTILES('+field+');50',
                        'PERCENTILES('+field+');05'
                    ];
        }
    }
    return VRouterViewConfig;
});