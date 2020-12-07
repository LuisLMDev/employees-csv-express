const express = require("express");
const fs = require("fs");
const app = express();

app.get("/employee/:id/:attribute?", function (req, res) {
	const id = req.params.id;
	const attribute = req.params.attribute;

	//Reading file
	fs.readFile("./data/employees.csv", "utf8", function (err, data) {
		if (err) {
			return res.status(500).send({
				msg: err.message,
			});
		}

		const headers = data.slice(0, data.indexOf("\n")).split(",");
		const employeeData = data.slice(data.indexOf("\n") + 1).split("\n");

		//Formatting info
		let employees = employeeData.map((row) => {
			let values = row.split(",");
			return headers.reduce(
				(object, curr, i) => ((object[curr] = values[i]), object),
				{}
			);
		});

		let employeesId = employees.filter((employee) => employee.id == id);

		//Checking if the ID is valid
		if (employeesId == "") {
			return res.status(400).send({
				msg: "Requested ID was not found",
			});
		}

		//Looking fot the attribute
		if (attribute != null) {
			if (attribute in employeesId[0]) {
				return res.status(200).send({
					[attribute]: employeesId[0][attribute],
				});
			}

			//Attribute error message
			return res.status(400).send({
				msg:
					"Attribute is not found. Please select one of the following attributes: -id -first_name -last_name -email -ip_address",
			});
		}

		res.send(employeesId[0]);
	});
});

//Starting server
app.listen(3000, function () {
	console.log("Application started on port 3000.");
});
