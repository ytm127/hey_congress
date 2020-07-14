import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CongressmanCard } from './components/congressman-card';
import { Button, Box, Text, Heading, Flex } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { ThemeProvider } from 'emotion-theming';
import theme from '@rebass/preset';
import './App.css';
import { getState } from './utils';
import logo from '../src/activism_pic.jpg';

function App() {
	const [ allSenators, setAllSenators ] = useState([]);
	const [ listOfSenators, setListOfSenators ] = useState([]);
	const [ listOfReps, setListOfReps ] = useState([]);
	const [ userLocation, setUserLocation ] = useState({ state: null, district: null, zip: null });
	const [ isLoading, setIsLoading ] = useState(false);
	const [ placeholderZip, setPlaceholderZip ] = useState(null);

	//********* ON MOUNT *********/
	useEffect(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				const latlng = `${position.coords.latitude}, ${position.coords.longitude}`;
				axios
					.get(
						`https://api.geocod.io/v1.6/reverse?q=${latlng}&&fields=cd&api_key=d5cad54ac545cd2cb9d2f0c525df55a0c450fad`
					)
					.then((res) => {
						setPlaceholderZip(res.data.results[0].address_components.zip);
					})
					.catch((err) => console.error(err));
			});
		} else {
			console.log('Not Available');
		}
		// get ALL senators on init
		axios
			.get('https://api.propublica.org/congress/v1/116/senate/members.json', {
				headers: {
					'X-API-Key': 'Gp5WuTAlck2YqCBBLPuHzIrvVtqgDMlALlUKAFDt'
				}
			})
			.then((res) => setAllSenators(res.data.results[0].members))
			.catch((error) => console.error(error));
	}, []);

	useEffect(
		() => {
			handleGetReps();
			handleGetSenators(userLocation.state);
		},
		[ userLocation ]
	);

	useEffect(
		() => {
			// update district accordingly anytime zip changes
			if (userLocation.zip) {
				axios
					.get(
						`https://api.geocod.io/v1.6/geocode?postal_code=${userLocation.zip}&fields=cd&api_key=d5cad54ac545cd2cb9d2f0c525df55a0c450fad`
					)
					.then((res) => {
						const district = res.data.results[0].fields.congressional_districts[0];
						setUserLocation({ ...userLocation, ...{ district } });
					})
					.catch((err) => console.error(err));
			}
		},
		[ userLocation.zip ]
	);

	const clearLists = () => {
		setListOfSenators([]);
		setListOfReps([]);
	};

	const handleGetSenators = (st) => {
		setIsLoading(true);
		const senators = allSenators.filter((senator) => senator.state === st);
		setListOfSenators(senators);
		setIsLoading(false);
	};

	const handleGetReps = () => {
		if (userLocation.district) {
			let districtParam = () => {
				if ([ 'DC', 'AK', 'DE', 'MT', 'ND', 'SD', 'VT', 'WY' ].includes(userLocation.state)) return 1;
				else return userLocation.district.district_number;
			};
			axios
				.get(
					` https://api.propublica.org/congress/v1/members/house/${userLocation.state}/${districtParam()}/current.json`,
					{
						headers: {
							'X-API-Key': 'Gp5WuTAlck2YqCBBLPuHzIrvVtqgDMlALlUKAFDt'
						}
					}
				)
				.then((res) => {
					setListOfReps(res.data.results);
				})
				.catch((err) => console.error(err));
		}
	};

	const getUserLocationWithLatLng = (latlng) => {
		axios
			.get(
				`https://api.geocod.io/v1.6/reverse?q=${latlng}&&fields=cd&api_key=d5cad54ac545cd2cb9d2f0c525df55a0c450fad`
			)
			.then((res) => {
				const st = res.data.results[0].address_components['state'];
				const districtData = res.data.results[0].fields.congressional_districts[0];
				setUserLocation({ state: st, district: districtData });
			})
			.catch((err) => console.error(err));
	};

	const handleLookUpUserLocation = () => {
		let locationPayload = {};
		setIsLoading(true);
		// GET USER LOCATION (LATITUDE/LONGITUDE)
		navigator.geolocation.getCurrentPosition((position) => {
			const latlng = `${position.coords.latitude}, ${position.coords.longitude}`;
			getUserLocationWithLatLng(latlng);
			axios
				.get(
					`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyD5ZpUp3QDxo9YgwlZ7y-j-S8xOCe17XnA`
				)
				.then((res) => {
					// Add STATE location to look up Senators
					locationPayload.state = res.data.plus_code.compound_code.split(',')[1].replace(/\s/g, '');
					// HANDLE FETCH SENATOR
					handleGetSenators(locationPayload.state);
					handleGetReps();
					setIsLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setIsLoading(false);
				});
		});
	};

	const handleInput = (e) => {
		clearLists();
		let val = e.target.value;
		if (val.length === 5) {
			setUserLocation({ state: getState(val), zip: val });
		}
		if (val.length === 0) {
			setUserLocation({ state: null, zip: null });
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<div className="App" style={{ height: '100vh' }}>
				{/* <Flex>
					<Box p={3} width={1 / 5} bg="#ef476f" />
					<Box p={3} width={1 / 5} bg="#ffd166" />
					<Box p={3} width={1 / 5} bg="#06d6a0" />
					<Box p={3} width={1 / 5} bg="#118ab2" />
					<Box p={3} width={1 / 5} bg="#073b4c" />
				</Flex> */}
				<Box
					sx={{
						m:2,
						p: 4,
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),
						rgba(0, 0, 0, 0.5)), url(${logo})`,
						backgroundSize: 'cover',
						borderRadius:10
					}}
				>
					<Text fontSize={[ 6, 100, 150 ]} sx={{ p: 3, color: 'white', fontWeight: 'bolder' }}>
						HEY <br /> CONGRESS!
					</Text>
					<br />
					<br />

					<Box sx={{ mb: 3 }}>
						<Label htmlFor="zipcode" sx={{ color: 'white' }}>
							SEARCH BY ZIPCODE
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder={placeholderZip ? `${placeholderZip}...` : 'Type in zipcode...'}
							onChange={handleInput}
							sx={{ background: 'white' }}
						/>
					</Box>
					<Text sx={{ color: 'white' }}>- OR -</Text>
					<Button sx={{ mt: 3 }} onClick={handleLookUpUserLocation}>
						Use my location
					</Button>
					<Text sx={{ fontSize: 1, color: 'grey' }}>recommended</Text>
				</Box>
				<Box sx={{ margin: 'auto' }}>
					{isLoading ? (
						'loading...'
					) : (
						listOfReps &&
						listOfReps.length !== 0 && (
							<div>
								{console.log({listOfSenators, listOfReps})}
								{listOfSenators.length > 0 && <p style={{ fontSize: 12 }}>SENATORS</p>}
								{listOfSenators.map((person) => <CongressmanCard person={person} />)}
								<p style={{ fontSize: 12 }}>REPRESENTATIVE</p>
								{listOfReps.map((person) => <CongressmanCard person={person} />)}
							</div>
						)
					)}
				</Box>
			</div>
		</ThemeProvider>
	);
}

export default App;
