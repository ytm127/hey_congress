import React from 'react';
import { Button, Box, Text, Card, Heading } from 'rebass';

export const CongressmanCard = ({ lastName, firstName, party, phone }) => {
	return (
		<Card width={256} sx={{ m: 'auto', mb: 2, bg: 'lightgrey', borderRadius: 5 }}>
			<Heading sx={{ fontSize: 2 }}>
				<a href={`tel:${phone}`} style={{ color: 'white', margin:'0 10px 0 10px' }}>
					<img src="https://img.icons8.com/ios/50/000000/phone.png" style={{ height: 20, width: 20 }} />
				</a>
				{firstName} {lastName} ({party})
			</Heading>
		</Card>
	);
};
