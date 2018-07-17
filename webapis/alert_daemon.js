const mongoose = require("mongoose")
var db = mongoose.connect('mongodb://localhost/test');

var alert = require("./db/models/alert"),
    event = require("./db/models/event"),
    user = require("./db/models/user"),
    email = require("./db/models/email"),
    jobCount = 0;

var checkExit = () => {
    if (jobCount == 0) {
        console.log("Quiting");
        mongoose.disconnect();
        process.exit(0);
    }
}

var checkExpiredAccounts = () => {
    var n = new Date();
    var qry = user.find({
        expiration_time: { $lt: n.getTime() },
        customer_id: null
    })

    qry.exec((err, users) => {
        jobCount += users.length;
        for (var i = users.length - 1; i >= 0; i--) {
            var u = users[i];
            alertOutstandingAccount(u);
        }
    })
}

var alertOutstandingAccount = (u) => {
    alert.update({
        name: "Trial over...",
        owner: u._id
    }, {
        $set: {
            description: "Please add your payment information to preserve your account."
        }
    }, { upsert: true }, function(err) {
        if (err) {
            console.log(err);
        }
        jobCount--;
        checkExit();
    })
}

var checkEvents = () => {
    var n = new Date();
    var qry = event.find({ $where: `function(){
            return this.end_date.getTime() < (new Date("${n}")).getTime() && !this.meta.proc;
	}` })

    qry.exec((err, events) => {
        if (err) {
            console.log(err);
            return;
        }
        jobCount += events.length;

        for (var i = events.length - 1; i >= 0; i--) {
            var e = events[i];
            gatherEventPerformance(e);
        }

        checkExit();
    })
}


var gatherEventPerformance = (e) => {
    e.meta.proc = true;
    event.findOneAndUpdate({ _id: e._id }, {
            $set: {
                meta: e.meta
            }
        },
        function(err, e) {
            if (err) {
                console.log(err);
            }

            email.count({ event: e._id }, function(err, c) {
                if (err) {
                    console.log(err)

                }
                e.count = c;
                alertEventOwner(e);
            });

        });
}

var alertEventOwner = (e) => {
    var a = new alert();
    a.name = `Your event ${event.name} is finished.`;
    a.description = `${event.count} ${event.count == 1 ? 'person' : 'people'} RSVP'd to your event.`
    a.owner = e.owner;
    a.save((err) => {
        if (err) {
            console.log(err);
        }
        jobCount--;
        checkExit();
    })
}

checkEvents();
checkExpiredAccounts();