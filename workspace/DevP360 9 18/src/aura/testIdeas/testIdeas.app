<aura:application >
    Hello Lets test Popover component
    
        <div>Hover here ->>
            <c:Popover >
                <aura:set attribute="popover">
                    <img src="https://www.w3schools.com/html/w3schools.jpg"/>
                </aura:set>
                <a href="javascript:void(0);">&nbsp;Popover</a>
            </c:Popover>
            &nbsp;and see a popover!
        </div>
    
</aura:application>