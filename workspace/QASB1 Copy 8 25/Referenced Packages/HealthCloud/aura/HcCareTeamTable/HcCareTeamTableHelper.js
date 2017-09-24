({
    refreshData : function( component ) {
        var dataProvider = component.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = {type : 'DataFetch'};
        var eventData = {parameters : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
    },

    showModalComponent: function( component, innerComponentMarkup, attributes ) {
        $A.createComponent(innerComponentMarkup, attributes,
            function( view, status, errorMessage ) {
                component.set("v.modal", view);
            }
        );
    },

    resetModalComponent: function( component ) {
        var modal = component.get('v.modal');
        if (modal != undefined && modal.length > 0) {
            component.set('v.modal', []);
        }
    },

    actionMap : {

        EditMember : function( component, memberData ) {
            HC.invokeEditRecord( null, memberData.name, memberData.memberId );
        },

        AddMemberToCommunity : function( component, memberData, thisHelper ) {
            var attributes = { memberObj: memberData };
            thisHelper.showModalComponent( component, "HealthCloudGA:HcCareTeamEnableCommCmp", attributes );
        },

        PrivateMessage : function( component, memberData, thisHelper ) {
            var attributes = { memberObj: memberData };
            thisHelper.showModalComponent( component, "HealthCloudGA:HcCareTeamDirectMessageCmp", attributes );
        },

        CreateTask : function( component, memberData, thisHelper ) {
            var attributes = {
                memberObj: memberData,
                isHealthConsole: "true",
                carePlanId: memberData.parentId || "",
                AssignedTo: memberData.memberId || "",
                fromWhere: "CareTeam",
                userDateFormat: component.get('v.userDateFormat'),
                userDateTimeFormat: component.get('v.userDateTimeFormat')
            };
            thisHelper.showModalComponent( component, "HealthCloudGA:HcTask", attributes );
        },

        RemoveMember : function( component, memberData, thisHelper ) {
            var attributes = { memberObj: memberData };
            thisHelper.showModalComponent( component, "HealthCloudGA:HcCareTeamRemoveModalCmp", attributes );
        }

    },

	handleCareTeamTableAction : function( component, actionType, memberData ) {
	   if( this.actionMap.hasOwnProperty( actionType ) )
       {
            this.actionMap[ actionType ]( component, memberData, this );
       }	
	},

    modalEventMap : {

        REMOVEMODAL : function( component, thisHelper ) {
            thisHelper.resetModalComponent( component );
            thisHelper.refreshData( component );
        },

        CANCELMODAL : function( component, thisHelper ) {
            thisHelper.resetModalComponent( component );
        }
    },

    handleCareTeamModalEvent: function( component, event ) {
        var eventType = event.getParam("type");
        if( this.modalEventMap.hasOwnProperty( eventType ) )
        {
            this.modalEventMap[ eventType ]( component, this );
        }
    }
})