/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define(
    ['underscore', 'contrail-view', 'monitor-infra-vrouter-model',
    'contrail-list-model','cf-datasource',"vrouter-viewconfig"
//    '/monitor/infrastructurevrouter/ui/js/models/VRouterDetailsBandwidthChartListModel',
    ],
    function(
        _, ContrailView, VRouterListModel,ContrailListModel,CFDataSource,VRouterViewConfig) {

        var VRouterListView = ContrailView.extend({
            render: function() {
                var self = this;
                var vrouterViewConfig = new VRouterViewConfig();
//                var vRouterListModel = new VRouterListModel();
//                self.vRouterListModel = vRouterListModel;
//                //ListModel that is kept in sync with crossFilter
//                var vRouterUIListModel = new ContrailListModel({data:[]});
//                var cfDataSource = new CFDataSource();
//                self.cfDataSource = cfDataSource;
//                //vRouterListModel -> crossFilter(optional) & vRouterUIListModel
//                //crossFilter -> vRouterListModel
//                //Update cfDataSource on vRouterListModel update
//
//                if(cfDataSource.getDimension('gridFilter') == null) {
//                    cfDataSource.addDimension('gridFilter',function(d) {
//                        return d['name'];
//                    });
//                }
//                if(cfDataSource.getDimension('colorFilter') == null) {
//                    cfDataSource.addDimension('colorFilter',function(d) {
//                        return d['color'];
//                    });
//                }
//                function onUpdatevRouterListModel() {
//                    cfDataSource.updateData(vRouterListModel.getItems());
//
//                    cfDataSource.fireCallBacks({source:'fetch'});
//                }
//
//                function onUpdatevRouterUIListModel() {
//                    if(vRouterUIListModel.updateFromcrossFilter != true) {
//                        var selRecords = vRouterUIListModel.getFilteredItems();
//                        var selIds = $.map(selRecords,function(obj,idx) {
//                            return obj.name;
//                        });
//
//                        self.vRouterListModel.updateFromUIListModel = true;
//                        //Apply filter only if filteredRows is < totalRows else remove the filter
//                        if(vRouterUIListModel.getFilteredItems().length < vRouterUIListModel.getItems().length) {
//                            cfDataSource.applyFilter('gridFilter',function(d) {
//                                return $.inArray(d,selIds) > -1;
//                            });
//                            cfDataSource.fireCallBacks({source:'grid'});
//                        } else {
//                            //Remove if an earlier filter exists
//                            if(cfDataSource.getFilter('gridFilter') != null) {
//                                cfDataSource.removeFilter('gridFilter');
//                                cfDataSource.fireCallBacks({source:'grid'});
//                            }
//                        }
//                    } else {
//                        vRouterUIListModel.updateFromcrossFilter = false;
//                    }
//                }
//
//                //As cfDataSource is core one,triggered whenever filters applied/removed
//                //If udpate is triggered from
//                //  1. vRouterListModel, update both crossfilter & grid
//                //  2. crossfilter, update grid
//                //  3. grid, update crossfilter
//                cfDataSource.addCallBack('updateCFListModel',function(data) {
//                    vRouterUIListModel.updateFromcrossFilter = false;
//                    //Update listUIModel with crossfilter data
//                    if(data['cfg']['source'] != 'grid') {
//                        //Need to get the data after filtering from dimensions other than gridFilter
//                        var currGridFilter = cfDataSource.removeFilter('gridFilter');
//                        vRouterUIListModel.setData(cfDataSource.getDimension('gridFilter').top(Infinity).sort(dashboardUtils.sortNodesByColor));
//                        if(currGridFilter != null) {
//                            cfDataSource.applyFilter('gridFilter',currGridFilter);
//                        }
//                    }
//                    if(data['cfg']['source'] == 'crossFilter')
//                        vRouterUIListModel.updateFromcrossFilter = true;
//                });


                this.renderView4Config(this.$el,
                    null,//TODO revisit if required //vRouterUIListModel,
                    getVRouterListViewConfig(self),null,null,null,
                    function() {
//                        //Need to trigger/register the event once callbacks are registered
//                        vRouterListModel.onDataUpdate.subscribe(onUpdatevRouterListModel);
//                        //Adding grid search filter
//                        vRouterUIListModel.onDataUpdate.subscribe(onUpdatevRouterUIListModel);
//                        if(vRouterListModel.loadedFromCache) {
//                            onUpdatevRouterListModel();
//                        }
                    });
                function getVRouterListViewConfig(self) {
                    return {
                         elementId: cowu.formatElementId([
                             ctwl.VROUTER_SUMMARY_LIST_SECTION_ID
                         ]),
                         view: "CarouselView",
                         viewConfig: {
                             pages : [
                                  {
                                      page: {
                                          elementId: 'grid-stack-view-page-1',
                                          view: 'GridStackView',
                                          viewConfig: {
                                              gridAttr: {
                                                  defaultWidth: 12,
                                                  defaultHeight: 10
                                              },
                                              widgetCfgList: [
                                                  vrouterViewConfig.getViewConfig('vrouter-flow-rate-area-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-cpu-mem-scatter-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-bandwidth-percentile-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-system-cpu-percentiles-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-system-memory-percentiles-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-summary-grid'),
                                                  vrouterViewConfig.getViewConfig('vrouter-crossfilters-chart')
                                              ]
                                          }
                                      },
                                  },
                                  {

                                      page : {

                                          elementId: 'grid-stack-view-page-2',
                                          view: 'GridStackView',
                                          viewConfig: {
                                              gridAttr: {
                                                  defaultWidth: 12,
                                                  defaultHeight: 10
                                              },
                                              widgetCfgList: [
                                                  vrouterViewConfig.getViewConfig('vrouter-system-cpu-mem-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-vn-int-inst-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-agent-cpu-percentiles-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-agent-mem-usage-percentiles-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-active-flows-percentiles-chart'),
                                                  vrouterViewConfig.getViewConfig('vrouter-summary-grid')
                                              ]
                                          }
                                      }
                                  },
                             ]
                         }
                    };
                };
            }
        });
        return VRouterListView;
    });