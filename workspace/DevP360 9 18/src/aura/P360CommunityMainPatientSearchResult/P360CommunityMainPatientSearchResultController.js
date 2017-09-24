({
    myAction : function(component, event, helper) {
        var sessionAction = component.get("c.updateUserSession");
        var gender = component.get("v.Gender");
        var cin=component.get("v.CIN");
        var dob=component.get("v.DOB");
        console.log("hello "+dob);
        if(typeof gender == 'undefined' || gender == null)
            gender ='';
        if(cin == 'undefined' || cin == null)
            cin ='';
        
        if(dob == 'undefined' || dob == null)
            dob ='';
        
        sessionAction.setParams({          
            currentPage : component.get("v.currentPage"),
            encounterId : component.get("v.encounterId"),
            fname : component.get("v.FName"),
            lname : component.get("v.LName"),
            cin : cin,
            dob : dob,
            gender : gender
        });
        sessionAction.setCallback(this, function(response)
                                  {
                                      var state = response.getState();
                                      if (state === "SUCCESS")
                                      {
                                          var res = response.getReturnValue();
                                          console.log('User Session data updated2' + res);
                                      }
                                      else
                                      {
                                          console.log('Error');
                                      }
                                  });
        $A.enqueueAction(sessionAction);
    }
})