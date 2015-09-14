/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var QEConstants = function () {
        this.TIMERANGE_DROPDOWN_VALUES = [
            {'id': 600, 'text': 'Last 10 Mins'},
            {'id': 1800, 'text': 'Last 30 Mins'},
            {'id': 3600, 'text': 'Last 1 Hr'},
            {'id': 21600, 'text': 'Last 6 Hrs'},
            {'id': 43200, 'text': 'Last 12 Hrs'},
            {'id': -1, 'text': 'Custom'}
        ];

        this.DIRECTION_DROPDOWN_VALUES = [
            {'id': '1', 'text': 'INGRESS'},
            {'id': '0', 'text': 'EGRESS'}
        ];

        this.FS_QUERY_PREFIX = "fs";
        this.FC_QUERY_PREFIX = "fc";
        this.FR_QUERY_PREFIX = "fr";
        this.STAT_QUERY_PREFIX = "stat";

        this.DEFAULT_QUERY_PREFIX = 'query';
        this.FLOW_SERIES_TABLE = "FlowSeriesTable";
    };
    return QEConstants;
});
