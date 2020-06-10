import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../style/App.scss';
import NavBarSignedIn from "./NavBarSignedIn";
import NavBarSignedOut from "./NavBarSignedOut";
import Landing from "./Landing";
import Login from "./Login";
import Registration from './Registration'
import Events from "./Events";
import SignUp from './SignUp';
import Footer from './Footer';
import Account from "./Account";
import EventInformation from "./EventInformation";
import CreateEvent from "./CreateEvent";
import Context from './Context';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState('');
  const [meetups, setMeetups] = useState('')
  const [workshops, setWorkshops] = useState('');
  const [conventions, setConventions] = useState('');
  const [citiesWithEvent, setCitiesWithEvent] = useState('');

  const [userData, setUserData] = useState(null);
  // localstorage to save the token coming from the header. by clicking on signout the localstorage will be cleared:
  const [storage, setStorage] = useState(localStorage.getItem('x-auth'));
  // this is the state that is going to carry all the information of one specific event, when the user clicks on it to see the description:
  const [eventInfo, setEventInfo] = useState(null);

  // console.log('CURRENT EVENT INFO: ', eventInfo);

  // FETCHING GOOGLE MAPS API:
  useEffect(() => {
    const script = document.createElement('script');

    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const allEventsTogether = [];
      const allCities = [];

      const response = await fetch('http://localhost:4000/events', options);
      const meetups = await response.json();
      // console.log('MEETUPS - Response: ', meetups);
      meetups.events.map(meetup => allEventsTogether.push(meetup));
      setMeetups(meetups.events.filter(event => !event.url)
      );

      const response2 = await fetch('http://localhost:4000/workshops', options);
      const workshops = await response2.json();
      // console.log('WORKSHOPS - Response: ', workshops);
      workshops.events.map(workshop => allEventsTogether.push(workshop));
      setWorkshops(workshops.events.filter(event => event.url.includes('meetup'))
      );

      const response3 = await fetch('http://localhost:4000/conventions', options);
      const conventions = await response3.json();
      // console.log('CONVENTIONS - Response: ', conventions);
      conventions.events.map(convention => allEventsTogether.push(convention));
      setConventions(conventions.events.filter(event => event.url.includes('eventbrite'))
      );

      // we extract all the cities where an event is going to take place:
      allEventsTogether.map(event => allCities.push(event.city));
      const extractedCities = [...new Set(allCities)];

      // console.log('ALL EVENTS: ', allEventsTogether);
      // console.log('ALL CITIES: ', extractedCities);

      setCitiesWithEvent(extractedCities);
      setEvents(allEventsTogether);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (storage) {
      const getUserData = async () => {
        const options = {
          method: 'GET',
          headers: {
            'x-auth': storage,
            'Content-Type': 'application/json'
          }
        };

        const response = await fetch('http://localhost:4000/users', options);
        const data = await response.json();

        setUserData(data.data);
      };

      setLoggedIn(true);
      getUserData();
    }
  }, []);

  // console.log('ALL EVENTS FETCHED: ', events);

  return (
    <div className="App">
      <Context.Provider value={{ loggedIn, setLoggedIn, storage, setStorage, userData, setUserData, eventInfo, setEventInfo, events, setEvents, meetups, workshops, conventions, citiesWithEvent }}>
        <BrowserRouter>
          {
            loggedIn ?
              <NavBarSignedIn />
              :
              <NavBarSignedOut />
          }
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/registration" component={Registration} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/events" component={Events} />
            <Route path="/account" component={Account} />
            <Route path="/event" component={EventInformation} />
            <Route path="/addevent" component={CreateEvent} />
          </Switch>
        </BrowserRouter>
        <Footer />
      </Context.Provider>
    </div>
  );
};

export default App;