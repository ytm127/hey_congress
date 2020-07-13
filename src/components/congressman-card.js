import React from 'react';
import { Button, Box, Flex, Card, Heading } from 'rebass';

export const CongressmanCard = ({person}) => {
	const { last_name, first_name, party, phone } = person
	const firstName = first_name
	const lastName = last_name

	const hasPhoneNumber = phone
	return (
		<Card width={256} sx={{ m: 'auto', mb: 2, bg: 'whitesmoke', borderRadius: 5, p: 1 }}>
			<Flex>
				<Box sx={{ background:  hasPhoneNumber ? 'lightgreen' : 'whitesmoke', borderRadius: 5 }} width={1 / 5} >
				{
					hasPhoneNumber ? 	<a href={`tel:${phone}`} style={{ margin: '0 10px 0 10px' }}>
					<img src="https://img.icons8.com/ios/50/000000/phone.png" style={{ height: 20, width: 20 }} />
				</a> : <div>+</div>
				}
				</Box>
				<Box width={4 / 5}>
					<Heading sx={{ fontSize: 2 }}>
						{firstName} {lastName} ({party})
					</Heading>
				</Box>
			</Flex>

		</Card>
	);
};
