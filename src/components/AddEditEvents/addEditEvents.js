import $ from 'jquery';
import authHelpers from '../../helpers/authHelpers';
import eventsData from '../../helpers/Data/eventData';
import initializeEventsSection from '../EventsPage/eventsPage';
import eventsHelper from '../../helpers/eventsHelpers';
import './addEditEvents.scss';

const formBuilder = (event) => {
  const form = `
  <div class="form-group">
    <label for="form-event-title">Event:</label>
    <input type="text" class="form-control event-form" value ="${event.event}" id="form-event-title" placeholder="Enter Event Name" autofocus>
  </div>
  <div class="form-group">
    <label for="form-event-startDate">Start Date:</label>
    <input type="text" class="form-control event-form" value ="${event.startDate}" id="form-event-startDate" placeholder="mm/dd/yyyy">
  </div>
  <div class="form-group">
    <label for="form-event-location">Location:</label>
    <input type="email" class="form-control event-form" value ="${event.location}" id="form-event-location" placeholder="Enter Location">
  </div>`;
  return form;
};

// Add Event
const gettingEventFromForm = () => {
  const currentTime = eventsHelper.timeStamp();
  const event = {
    event: $('#form-event-title').val(),
    startDate: $('#form-event-startDate').val(),
    location: $('#form-event-location').val(),
    userUid: authHelpers.getCurrentUid(),
    created: currentTime,
  };
  return event;
};

const buildAddForm = () => {
  const emptyEvent = {
    event: '',
    startDate: '',
    location: '',
    created: '',
  };
  let domString = '<div class="add-form">';
  domString += '<button class="btn btn-danger" id="back-add-button">back</button>';
  domString += '<h2> Add New Event</h2>';
  domString += formBuilder(emptyEvent);
  domString += '<button class="btn btn-secondary" id="add-new-event">Save New Event</button>';
  domString += '</div>';
  $('#add-edit-event').html(domString).show();
  $('#events').hide();
};

const addNewEvent = () => {
  const newEvent = gettingEventFromForm();
  const eventInput = newEvent.event;
  const locationInput = newEvent.location;
  const dateInput = newEvent.startDate;
  if ((eventInput === '') || (locationInput === '') || (dateInput === '')) {
    eventsHelper.emptyInputFields();
  } else {
    eventsHelper.resetInputFields();
    eventsData.addNewEvent(newEvent)
      .then(() => {
        $('#add-edit-event').html('').hide();
        $('#events').show();
        initializeEventsSection();
      }).catch((error) => {
        console.error(error);
      });
  }
};

// Edit Event
const showEditForm = (e) => {
  const idtoEdit = e.target.dataset.editId;
  eventsData.getSingleEvent(idtoEdit)
    .then((singleEvent) => {
      let domString = `<div class="edit-form" data-single-edit-id=${singleEvent.id}>`;
      domString += '<button class="btn btn-danger" id="back-edit-button">back</button>';
      domString += '<h2> Edit Event</h2>';
      domString += formBuilder(singleEvent);
      domString += `<button id="edit-event" class="btn btn-secondary" data-single-edit-id=${singleEvent.id}>Save Event</button>`;
      domString += '</div>';
      $('#add-edit-event').html(domString).show();
      $('#events').hide();
    }).catch((error) => {
      console.error(error);
    });
};

const updateEvent = (e) => {
  const updatedEvent = gettingEventFromForm();
  const eventId = e.target.dataset.singleEditId;
  eventsData.updateEvent(updatedEvent, eventId)
    .then(() => {
      $('#add-edit-event').html('').hide();
      $('#events').show();
      initializeEventsSection();
    }).catch((error) => {
      console.error(error);
    });
};

$('body').on('click', '#add-new-event', addNewEvent);
$('body').on('click', '.edit-button', showEditForm);
$('body').on('click', '#edit-event', updateEvent);
$('body').on('keyup', '.add-form', (e) => {
  if (e.keyCode === 13) {
    addNewEvent();
  }
});

export default buildAddForm;
