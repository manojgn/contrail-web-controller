/*
 * Copyright (c) 2015 Junper Networks, Inc. All rights reserved.
 */

 define(['underscore'], function(_){
     this.controlNodePeersMockData = 
     {
             "data": {
               "bgp-peer": {
                 "value": [
                   {
                     "name": "default-domain:default-project:ip-fabric:__default__:nodec64:default-domain:default-project:ip-fabric:__default__:blr-mx2",
                     "value": {
                       "BgpPeerInfoData": {
                         "state_info": {
                           "last_state": "OpenConfirm",
                           "state": "Established",
                           "last_state_at": 1450273155066664
                         },
                         "peer_stats_info": {
                           "tx_proto_stats": {
                             "notification": 0,
                             "update": 190,
                             "close": 0,
                             "total": 59662,
                             "open": 1,
                             "keepalive": 59471
                           },
                           "tx_update_stats": {
                             "unreach": 64,
                             "total": 0,
                             "reach": 141,
                             "end_of_rib": 0
                           },
                           "rx_proto_stats": {
                             "notification": 0,
                             "update": 8,
                             "close": 0,
                             "total": 64692,
                             "open": 1,
                             "keepalive": 64683
                           },
                           "rx_update_stats": {
                             "unreach": 0,
                             "total": 0,
                             "reach": 27,
                             "end_of_rib": 0
                           },
                           "rx_error_stats": {
                             "inet6_error_stats": {
                               "bad_inet6_xml_token_count": 0,
                               "bad_inet6_prefix_count": 0,
                               "bad_inet6_nexthop_count": 0,
                               "bad_inet6_afi_safi_count": 0
                             }
                           }
                         },
                         "families": [
                           "inet-vpn",
                           "inet6",
                           "inet6-vpn",
                           "route-target"
                         ],
                         "admin_down": false,
                         "peer_type": "internal",
                         "local_asn": 64512,
                         "configured_families": [
                           "route-target",
                           "inet-vpn",
                           "e-vpn",
                           "inet6-vpn"
                         ],
                         "event_info": {
                           "last_event_at": 1450277126467051,
                           "last_event": "fsm::EvBgpUpdate"
                         },
                         "peer_port": 0,
                         "passive": false,
                         "local_id": 1759104010,
                         "negotiated_families": [
                           "inet-vpn",
                           "inet6-vpn",
                           "route-target"
                         ],
                         "send_state": "in sync",
                         "peer_address": "10.204.216.245",
                         "router_type": null,
                         "peer_id": 4124625930,
                         "hold_time": 90,
                         "peer_asn": 64512
                       }
                     }
                   },
                   {
                     "name": "default-domain:default-project:ip-fabric:__default__:nodec64:default-domain:default-project:ip-fabric:__default__:nodeg18",
                     "value": {
                       "BgpPeerInfoData": {
                         "state_info": {
                           "last_state": "OpenConfirm",
                           "state": "Established",
                           "last_state_at": 1450273154671328
                         },
                         "peer_stats_info": {
                           "tx_proto_stats": {
                             "notification": 0,
                             "update": 2313,
                             "close": 0,
                             "total": 61785,
                             "open": 1,
                             "keepalive": 59471
                           },
                           "tx_update_stats": {
                             "unreach": 1075,
                             "total": 0,
                             "reach": 2086,
                             "end_of_rib": 0
                           },
                           "rx_proto_stats": {
                             "notification": 0,
                             "update": 2868,
                             "close": 0,
                             "total": 62341,
                             "open": 1,
                             "keepalive": 59472
                           },
                           "rx_update_stats": {
                             "unreach": 1141,
                             "total": 0,
                             "reach": 2283,
                             "end_of_rib": 0
                           },
                           "rx_error_stats": {
                             "inet6_error_stats": {
                               "bad_inet6_xml_token_count": 0,
                               "bad_inet6_prefix_count": 0,
                               "bad_inet6_nexthop_count": 0,
                               "bad_inet6_afi_safi_count": 0
                             }
                           }
                         },
                         "families": [
                           "inet-vpn",
                           "inet6-vpn",
                           "route-target",
                           "e-vpn",
                           "erm-vpn"
                         ],
                         "admin_down": false,
                         "peer_type": "internal",
                         "local_asn": 64512,
                         "configured_families": [
                           "route-target",
                           "inet-vpn",
                           "e-vpn",
                           "erm-vpn",
                           "inet6-vpn"
                         ],
                         "event_info": {
                           "last_event_at": 1451989784435603,
                           "last_event": "fsm::EvBgpUpdate"
                         },
                         "peer_port": 0,
                         "passive": false,
                         "local_id": 1759104010,
                         "negotiated_families": [
                           "e-vpn",
                           "erm-vpn",
                           "inet-vpn",
                           "inet6-vpn",
                           "route-target"
                         ],
                         "send_state": "in sync",
                         "peer_address": "10.204.217.58",
                         "router_type": null,
                         "peer_id": 987352074,
                         "hold_time": 90,
                         "peer_asn": 64512
                       }
                     }
                   }
                 ]
               },
               "xmpp-peer": {
                 "value": [
                   {
                     "name": "nodec64:10.204.216.69",
                     "value": {
                       "XmppPeerInfoData": {
                         "state_info": {
                           "last_state": "Active",
                           "state": "Established",
                           "last_state_at": 1451827190608887
                         },
                         "peer_stats_info": {
                           "tx_proto_stats": {
                             "notification": 0,
                             "update": 408,
                             "close": 0,
                             "total": 8079,
                             "open": 1,
                             "keepalive": 7670
                           },
                           "tx_update_stats": {
                             "unreach": 40,
                             "total": 372,
                             "reach": 393,
                             "end_of_rib": 0
                           },
                           "rx_proto_stats": {
                             "notification": 0,
                             "update": 270,
                             "close": 0,
                             "total": 8212,
                             "open": 1,
                             "keepalive": 7941
                           },
                           "rx_update_stats": {
                             "unreach": 4,
                             "total": 123,
                             "reach": 119,
                             "end_of_rib": 0
                           },
                           "rx_error_stats": {
                             "inet6_error_stats": {
                               "bad_inet6_xml_token_count": 0,
                               "bad_inet6_prefix_count": 0,
                               "bad_inet6_nexthop_count": 0,
                               "bad_inet6_afi_safi_count": 0
                             }
                           }
                         },
                         "identifier": "nodec12",
                         "event_info": {
                           "last_event_at": 1451989784433924,
                           "last_event": "xmsm::EvXmppIqReceive"
                         },
                         "send_state": "in sync"
                       }
                     }
                   },
                   {
                     "name": "nodec64:10.204.217.102",
                     "value": {
                       "XmppPeerInfoData": {
                         "state_info": {
                           "last_state": "Active",
                           "state": "Established",
                           "last_state_at": 1450914879970150
                         },
                         "peer_stats_info": {
                           "tx_proto_stats": {
                             "notification": 0,
                             "update": 1239,
                             "close": 0,
                             "total": 39320,
                             "open": 1,
                             "keepalive": 38080
                           },
                           "tx_update_stats": {
                             "unreach": 369,
                             "total": 1239,
                             "reach": 1228,
                             "end_of_rib": 0
                           },
                           "rx_proto_stats": {
                             "notification": 0,
                             "update": 463,
                             "close": 0,
                             "total": 39008,
                             "open": 1,
                             "keepalive": 38544
                           },
                           "rx_update_stats": {
                             "unreach": 34,
                             "total": 222,
                             "reach": 188,
                             "end_of_rib": 0
                           },
                           "rx_error_stats": {
                             "inet6_error_stats": {
                               "bad_inet6_xml_token_count": 0,
                               "bad_inet6_prefix_count": 0,
                               "bad_inet6_nexthop_count": 0,
                               "bad_inet6_afi_safi_count": 0
                             }
                           }
                         },
                         "identifier": "nodec62",
                         "event_info": {
                           "last_event_at": 1451989684315531,
                           "last_event": "xmsm::EvXmppIqReceive"
                         },
                         "send_state": "not advertising"
                       }
                     }
                   }
                 ]
               }
             },
             "lastKey": null,
             "more": false
           };
return {controlNodePeersMockData : controlNodePeersMockData};
 });
