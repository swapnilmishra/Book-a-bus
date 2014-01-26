Templates = {};
 
Templates.seatbooking = [
		"<table class='table'>",
			"<thead>",
        "<tr>",
          "<th>Full Name</th>",
          "<th>Phone Number</th>",
          "<th>Departure Time</th>",
          "<th>Amount</th>",
        "</tr>",
      "</thead>",
      "<tr>",
		    "<td>{{customer_name}} </td>",
		    "<td>{{phone_number}} </td>",
		    "<td>{{departure_time}} </td>",
		    "<td>{{amount}} </td>",
		  "</tr>",
		"</table>"
    
].join("\n");


Templates.template  = function(templateName,data) {

	var source   = Templates[templateName]
		,	template = Handlebars.compile(source);

	return template(data);
}
