/*
 * Copyright (c) 2016 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-model',
    'config/firewall/common/addressgroup/ui/js/models/addressPrefixModel'
], function (_, ContrailModel, AddressRoleModel) {
    var serviceGroupModel = ContrailModel.extend({
        defaultConfig: {
            'uuid': '',
            'name': '',
            'label':'',
            'role_entries':{"roles":[]},
            'parent_type': 'policy-management',
            'parent_uuid': '',
            'address_group_prefix': {
                'subnet': [
                ]
              }
        },
        formatModelConfig: function(modelConfig) {
        	var roleModels = [];
            deletedRule = [],rule_obj = {};
            var list = modelConfig["address_group_prefix"];
            var subnetList = list['subnet'];
            if (subnetList != null && subnetList.length > 0) {
                for (var i = 0; i < subnetList.length; i++) {
                	rule_obj = subnetList[i];
                    var roleModel = new AddressRoleModel(rule_obj);
                    roleModels.push(roleModel)
                }
            }
            var subnetCollectionModel = new Backbone.Collection(roleModels);
            modelConfig['subnetCollection'] = subnetCollectionModel;
            modelConfig["role_entries"]["roles"] = subnetCollectionModel;
            return modelConfig;
        },
        addSubnet: function(){
            var subnetList = this.model().attributes['subnetCollection'],
            newAddressRoleModel = new AddressRoleModel();
            subnetList.add([newAddressRoleModel]);
        },
        deleteSubnet: function(data, role) {
            var roleCollection = data.model().collection,
            delRole = role.model();
            var model = $.extend(true,{},delRole.attributes);
            roleCollection.remove(delRole);
        },
        deleteAddressGroup: function (checkedRows, callbackObj) {
            var ajaxConfig = {};
            var uuidList = [];

            $.each(checkedRows, function (checkedRowsKey, checkedRowsValue) {
                uuidList.push(checkedRowsValue.uuid);
            });

            ajaxConfig.type = "POST";
            ajaxConfig.data = JSON.stringify([{'type': 'address-group',
                                              'deleteIDs': uuidList}]);

            ajaxConfig.url = '/api/tenants/config/delete';
            contrail.ajaxHandler(ajaxConfig, function () {
                if (contrail.checkIfFunction(callbackObj.init)) {
                    callbackObj.init();
                }
            }, function (response) {
                if (contrail.checkIfFunction(callbackObj.success)) {
                    callbackObj.success();
                }
            }, function (error) {
                if (contrail.checkIfFunction(callbackObj.error)) {
                    callbackObj.error(error);
                }
            });
        },
        addEditAddressGroup: function (callbackObj, options) {
            var ajaxConfig = {}, returnFlag = true,updatedVal = {};
            var updatedModel = {},subnetList = [];
            var model = $.extend(true,{},this.model().attributes);
            var role = $.extend(true,{},model.role_entries.roles);
            var collection = role.toJSON();
                for(var j = 0; j < collection.length;j++){
                	var role = collection[j].prefix().split('/');
                	var ipPrefix = role[0].trim();
                	var ipPrefixLen = role[role.length-1].trim();
                	var subnetObj = {};
                	subnetObj.ip_prefix = ipPrefix;
                	subnetObj.ip_prefix_len = ipPrefixLen;
                	subnetList.push(subnetObj);
                }
                updatedModel.fq_name = [];
                if(options.isGlobal) {
                    updatedModel.fq_name.push('default-policy-management');
                    updatedModel.fq_name.push(model.name);
                    updatedModel.parent_type = 'policy-management';
                } else {
                    updatedModel.fq_name.push(
                            contrail.getCookie(cowc.COOKIE_DOMAIN_DISPLAY_NAME));
                    updatedModel.fq_name.push(
                            contrail.getCookie(cowc.COOKIE_PROJECT_DISPLAY_NAME));
                    updatedModel.fq_name.push(model.name);
                    updatedModel.parent_type = 'project';

                }
                updatedModel.name = model.name;
                updatedModel.address_group_prefix = {};
                updatedModel.address_group_prefix.subnet = subnetList;
                if (options.mode == 'add') {
                	var postData = {"data":[{"data":{"address-group": updatedModel},
                                "reqUrl": "/address-groups"}]};
                    ajaxConfig.url = ctwc.URL_CREATE_CONFIG_OBJECT;
                } else {
                	delete(updatedModel.name);
                	var postData = {"data":[{"data":{"address-group": updatedModel},
                                "reqUrl": "/address-group/" +
                                model.uuid}]};
                    ajaxConfig.url = ctwc.URL_UPDATE_CONFIG_OBJECT;
                }
                ajaxConfig.type  = 'POST';
                ajaxConfig.data  = JSON.stringify(postData);
                contrail.ajaxHandler(ajaxConfig, function () {
                    if (contrail.checkIfFunction(callbackObj.init)) {
                        callbackObj.init();
                    }
                }, function (response) {
                    if (contrail.checkIfFunction(callbackObj.success)) {
                        callbackObj.success();
                    }
                    returnFlag = true;
                }, function (error) {
                    if (contrail.checkIfFunction(callbackObj.error)) {
                        callbackObj.error(error);
                    }
                    returnFlag = false;
                });
            return returnFlag;
        }
    });
    return serviceGroupModel;
});