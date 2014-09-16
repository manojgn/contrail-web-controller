/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

/*
 * Analytics Nodes Details Page
 */
monitorInfraAnalyticsDetailsClass = (function() {
    this.populateDetailsTab = function (obj) {
        var nodeIp,iplist;
        //Compute the label/value pairs to be displayed in dashboard pane
        //As details tab is the default tab,don't update the tab state in URL
        if(obj.detailView === undefined) {
            layoutHandler.setURLHashParams({tab:'',ip:obj['ip'], node: obj['name']},{triggerHashChange:false});
        }    
        //showProgressMask('#analyticsnode-dashboard', true);
        //Destroy chart if it exists
        startWidgetLoading('analytics-sparklines' + '_' + obj.name);
        toggleWidgetsVisibility(['collector-chart' + '_' + obj.name + '-box'], ['queryengine-chart' + '_' + obj.name + '-box', 'opServer-chart' + '_' + obj.name + '-box']);
        var dashboardTemplate = contrail.getTemplate4Id('dashboard-template');
        $('#analyticsnode-dashboard' + '_' + obj.name ).html(dashboardTemplate({title:'Analytics Node',colCount:2, showSettings:true, widgetBoxId:'dashboard' + '_' + obj.name, name:obj.name}));
        startWidgetLoading('dashboard' + '_' + obj.name);

        $.ajax({
            url: contrail.format(monitorInfraUrls['ANALYTICS_DETAILS'], obj['name'])
        }).done(function (result) {
                aNodeData = result;
                var parsedData = infraMonitorUtils.parseAnalyticNodesDashboardData([{name:obj['name'],value:result}])[0];
                var noDataStr = "--";
                var cpu = "N/A", memory = "N/A", aNodeDashboardInfo;
                var endTime, startTime;
                $.ajax({
                    url: '/api/service/networking/web-server-info'
                }).done(function (resultJSON) {
                    endTime = resultJSON['serverUTCTime'];
                }).fail(function() {
                    endTime = getCurrentTime4MemCPUCharts();
                }).always(function() {
                    var slConfig;
                    startTime = endTime - 600000;
                    slConfig = {startTime: startTime, endTime: endTime};
                    $('#collector-sparklines' + '_' + obj.name).initMemCPUSparkLines(result, 'parseMemCPUData4SparkLines', {'ModuleCpuState': [
                        {name: 'collector_cpu_share', color: 'blue-sparkline'},
                        {name: 'collector_mem_virt', color: 'green-sparkline'}
                    ]}, slConfig);
                    $('#queryengine-sparklines' + '_' + obj.name).initMemCPUSparkLines(result, 'parseMemCPUData4SparkLines', {'ModuleCpuState': [
                        {name: 'queryengine_cpu_share', color: 'blue-sparkline'},
                        {name: 'queryengine_mem_virt', color: 'green-sparkline'}
                    ]}, slConfig);
                    $('#opServer-sparklines' + '_' + obj.name).initMemCPUSparkLines(result, 'parseMemCPUData4SparkLines', {'ModuleCpuState': [
                        {name: 'opserver_cpu_share', color: 'blue-sparkline'},
                        {name: 'opserver_mem_virt', color: 'green-sparkline'}
                    ]}, slConfig);
                    endWidgetLoading('analytics-sparklines' + '_' + obj.name);
                    $('#collector-chart' + '_' + obj.name).initMemCPULineChart($.extend({url:function() {
                        return contrail.format(monitorInfraUrls['FLOWSERIES_CPU'], 'Collector', '30', '10', obj['name'], endTime);
                    }, parser: "parseProcessMemCPUData", plotOnLoad: true, showWidgetIds: ['collector-chart' + '_' + obj.name + '-box'], hideWidgetIds: ['queryengine-chart' + '_' + obj.name + '-box', 'opServer-chart' + '_' + obj.name + '-box'], titles: {memTitle:'Memory',cpuTitle:'% CPU Utilization'}}),110);
                    $('#queryengine-chart' + '_' + obj.name).initMemCPULineChart($.extend({url:function() {
                        return contrail.format(monitorInfraUrls['FLOWSERIES_CPU'], 'QueryEngine', '30', '10', obj['name'], endTime);
                    }, parser: "parseProcessMemCPUData", plotOnLoad: false, showWidgetIds: ['queryengine-chart' + '_' + obj.name + '-box'], hideWidgetIds: ['collector-chart' + '_' + obj.name + '-box', 'opServer-chart' + '_' + obj.name + '-box'], titles: {memTitle:'Memory',cpuTitle:'% CPU Utilization'}}),110);
                    $('#opServer-chart' + '_' + obj.name).initMemCPULineChart($.extend({url:function() {
                        return contrail.format(monitorInfraUrls['FLOWSERIES_CPU'], 'OpServer', '30', '10', obj['name'], endTime);
                    }, parser: "parseProcessMemCPUData", plotOnLoad: false, showWidgetIds: ['opServer-chart' + '_' + obj.name + '-box'], hideWidgetIds: ['collector-chart' + '_' + obj.name + '-box', 'queryengine-chart' + '_' + obj.name + '-box'], titles: {memTitle:'Memory',cpuTitle:'% CPU Utilization'}}),110);
                });
                var statusTemplate = contrail.getTemplate4Id("statusTemplate");
                
                aNodeDashboardInfo = getAnalyticsNodeLblValuePairs(parsedData);
                /*Selenium Testing*/
                aNodeDetailsData = aNodeDashboardInfo;
                /*End of Selenium Testing*/             
                var cores=getCores(aNodeData);
                for(var i=0;i<cores.length;i++)
                    aNodeDashboardInfo.push(cores[i]);
                //showProgressMask('#analyticsnode-dashboard');
                var dashboardBodyTemplate = Handlebars.compile($("#dashboard-body-template").html());
                $('#analyticsnode-dashboard' + '_' + obj.name +' .widget-body').html(dashboardBodyTemplate({colCount:2, d:aNodeDashboardInfo, nodeData:aNodeData, showSettings:true, ip:nodeIp, name:obj.name}));
                var ipDeferredObj = $.Deferred();
                getReachableIp(iplist,"8089",ipDeferredObj);
                ipDeferredObj.done(function(nodeIp){
                    if(nodeIp != null && nodeIp != noDataStr) {
                        $('#linkIntrospect' + '_' + obj.name).unbind('click');
                        $('#linkIntrospect' + '_' + obj.name).click(function(){
                            window.open('/proxy?proxyURL=http://'+nodeIp+':8089&indexPage', '_blank');
                        });
                        $('#linkStatus' + '_' + obj.name).unbind('click');
                        $('#linkStatus' + '_' + obj.name).on('click', function(){
                            showStatus({ip : nodeIp, name : obj.name});
                        });
                        $('#linkLogs' + '_' + obj.name).unbind('click');
                        $('#linkLogs' + '_' + obj.name).on('click', function(){
                            showLogs(nodeIp);
                        }); 
                    }
                });
                endWidgetLoading('dashboard' + '_' + obj.name);
                initWidget4Id('#collector-chart' + '_' + obj.name + '-box');
                initWidget4Id('#queryengine-chart' + '_' + obj.name + '-box');
                initWidget4Id('#opServer-chart' + '_' + obj.name + '-box');
            }).fail(displayAjaxError.bind(null, $('#analyticsnode-dashboard' + '_' + obj.name)));
    }
    return {populateDetailsTab:populateDetailsTab};
})();

