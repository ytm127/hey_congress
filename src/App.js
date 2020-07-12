import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CongressmanCard } from './components/congressman-card';
import { Button, Box, Text, Heading } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { ThemeProvider } from 'emotion-theming';
import theme from '@rebass/preset';
import './App.css';
import {getState} from './utils'

function App() {
  const [ listOfCongressman, setListOfCongressman ] = useState([]);
  const [userLocation, setUserLocation] = useState(null)

	useEffect(() => {
		if ('geolocation' in navigator) {
			console.log('Available');
		} else {
			console.log('Not Available');
		}
  }, []);
  
  useEffect(()=>{
    // IF USER LOCATION CHANGES, MAKE NEW CALL 
    handleFetchSenators(userLocation)
  }, [userLocation])

  const handleFetchSenators = (st) => {
    axios
    .get(`https://api.propublica.org/congress/v1/members/senate/${st}/current.json`, {
      headers: {
        'X-API-Key': 'Gp5WuTAlck2YqCBBLPuHzIrvVtqgDMlALlUKAFDt'
      }
    })
    .then((res) => {
      console.log(res.data.results);
      setListOfCongressman(res.data.results)
    })
    .catch((error) => {
      console.error(error);
    });
  }

  // TODO 
	const handleLookUpUserLocation = () => {
    // GET USER LOCATION (LATITUDE/LONGITUDE)
		navigator.geolocation.getCurrentPosition((position) => {
			console.log({ position });
			console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      // const latlng = `${position.coords.latitude}, ${position.coords.longitude}`
      const latlng = `36.0822, -94.1719`
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyD5ZpUp3QDxo9YgwlZ7y-j-S8xOCe17XnA`)
      .then((res) => {
        console.log(res.data)

      })
      .catch((err) => {
        console.error(err)
      })
    });
    // HANDLE FETCH SENATOR
    handleFetchSenators()
  };
  
  const handleInput = (e) => {
    let val = e.target.value
    if(val.length === 5){
      setUserLocation(getState(val))
    }
  }

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Box sx={{ p: 5 }}>
					<Heading fontSize={[ 5, 6, 7 ]} color="black">
						Call <br />My <br />Congressman
					</Heading>
					<br />
					<br />

					<Box sx={{ mb: 3 }}>
						<Label htmlFor="zipcode">SEARCH BY ZIPCODE</Label>
						<Input id="email" name="email" type="email" placeholder="20003" onChange={handleInput} />
					</Box>
					<Text>- OR -</Text>
					<Button sx={{ mt: 3 }} onClick={handleLookUpUserLocation}>
						Use my location
					</Button>
				</Box>
      <Box sx={{margin: 'auto'}}>
      {
          listOfCongressman && listOfCongressman.map((person) => {
            return <CongressmanCard  name={person.name} party={person.party}/>
          })
        }
      </Box>
			</div>
		</ThemeProvider>
	);
}

export default App;
