({
	formatOptionsData: function(res, selectedValue) {
        var options = [];
        for (i = 0; i < res.length; i++) {
            options.push({
                'value': res[i],
                'selected': selectedValue == res[i] ? "true" : ""
            });
        }
        return options;
    },
})