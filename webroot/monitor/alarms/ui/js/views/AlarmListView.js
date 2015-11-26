/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view',
    'contrail-list-model'
], function (_, ContrailView, ContrailListModel) {
    var AlarmListView = ContrailView.extend({
        el: $(contentContainer),

        render: function () {
            var self = this, viewConfig = this.attributes.viewConfig;

//            var listModelConfig = {
//                remote: {
//                    ajaxConfig: {
//                        url: ctwc.get(ctwc.URL_ALARM_DETAILS_IN_CHUNKS, 50, $.now()),
//                        type: "GET"
//                    },
//                    dataParser: ctwp.alarmDataParser
//                }
//            };
//
//            var contrailListModel = new ContrailListModel(listModelConfig);
            self.renderView4Config(this.$el, null, getAlarmsListViewConfig());
        }
    });

    var getAlarmsListViewConfig = function () {
        return {
            elementId: cowu.formatElementId([ctwl.MONITOR_NETWORK_LIST_ID]),
            view: "SectionView",
            viewConfig: {
                rows: [
                    {
                        columns: [
                            {
                                elementId: ctwl.MONITOR_ALARM_LIST_ID,
                                title: ctwl.TITLE_ALARMS,
                                view: "AlarmGridView",
                                viewPathPrefix: "monitor/alarms/ui/js/views/",
                                app: cowc.APP_CONTRAIL_CONTROLLER,
                                viewConfig: {projectFQN: null, parentType: 'project', pagerOptions: {options: {pageSize: 10, pageSizeSelect: [10, 50, 100]}}}
                            }
                        ]
                    }
                ]
            }
        }
    };

    return AlarmListView;
});