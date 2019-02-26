const Event = require('../models/Event')
const entityHelper = require('../utilities/entityHelper')
let noChosenFileError = 'Трябва да изберете снимка!';
let errorMessage = 'Възникна грешка! Моля опитайте пак!';

module.exports.addGet = (req, res) => {
    res.render('event/add')
}

module.exports.addPost = (req, res) => {
    let event = req.body

    if(!req.file || !req.file.path){
        res.render('event/add', {error: noChosenFileError})
        return;
    }

    entityHelper.addBinaryFileToEntity(req, event);

    if(new Date(event.date) < Date.now()){
        res.render('event/add', {error: "Дата на събитието не може да бъде в миналото!"})
        return;
    }

    Event.create(event).then(() => {
        res.redirect('/')
    }).catch(err => {
        res.render('event/add', {error: errorMessage} )
    })
}

module.exports.deleteGet = (req, res) => {
    let id = req.params.id

    Event.findById(id).then(event => {
        let date = event.date.toDateString();
        event.formatedDate = date;
        res.render('event/delete', event)
    }).catch(err => {
        res.redirect('/');
    })
}

module.exports.deletePost = (req, res) => {
    let id = req.params.id

    Event.findByIdAndDelete(id).then(() => {
        res.redirect('/')
    }).catch(err => {
        res.redirect('/');
    })

}

module.exports.editGet = (req, res) => {
    let id = req.params.id

    Event.findById(id).then(event => {
        res.render('event/edit', event)
    }).catch(err => {
        res.redirect('/');
    })
}

module.exports.editPost = (req, res) => {
    let id = req.params.id
    let event = req.body

    if(!req.file || !req.file.path){
        event.error = noChosenFileError;
        res.render('event/edit', {event: event})
        return;
    }

    entityHelper.addBinaryFileToEntity(req, event);

    Event.findByIdAndUpdate(id, event).then(() => {
        res.redirect('/')
    }).catch((err) => {
        res.redirect('/');
    })
}

module.exports.getDetails = (req, res) => {
    let id = req.params.id;

    Event.findById(id)
        .then(event => {
        event.occupiedPlaces = event.users.length
        event.time = event.date.toDateString()
        entityHelper.addImageToEntity(event);
        if (req.user) {
            for (const userId of event.users) {
                if(userId.toString() === req.user.id.toString()){
                    event.currentUserIsRegistered = true
                }
            }
        }else{
            event.currentUserIsRegistered = false
        }
        res.render('event/details', event)
    }).catch(err =>{
        res.redirect('/')
    })
}

module.exports.getAllEvents = (req, res) => {
    let startDate = Date.now();
    Event.find({"date": {"$gte": startDate}}).then(events => {
        entityHelper.addImagesToEntities(events);
        res.render('event/all', {events: events})
    }).catch((err) => {
        res.redirect('/');
    })
}

module.exports.registerForEvent = (req, res) => {
    let userId = req.user.id;
    let eventId = req.params.id;

    Event.findById(eventId).then(event => {
        if (event.placesCount <= event.users.length ||
            event.users.includes(userId.toString())) {
            res.redirect('/event/details/' + eventId)
            return
        }

        event.users.push(userId)
        event.save().then(() => {
            res.redirect('/event/details/' + eventId)
        }).catch(err => {
            res.redirect('/event/details/' + eventId)
        })
    })
}

module.exports.unregisterFromEvent = (req, res) => {
    let eventId = req.params.id;
    let userId = req.user.id;

    Event.findById(eventId).then(event => {
        let index = event.users.indexOf(userId)

        if (index === -1) {
            console.log('the user is not registered')
            res.redirect('event/details/' + eventId)
            return
        }

        event.users.splice(index, 1)
        event.save().then(() => {
            res.redirect('/event/details/' + eventId)
        }).catch(err => {
            res.redirect('/event/details/' + eventId)
        })
    })
}