import React from 'react';
import { Button, Box, Text, Card, Heading } from 'rebass';

export const CongressmanCard = ({ name, party }) => {
	return (
		<Card width={256} sx={{ margin: 'auto' }}>
			<Heading>{name} ({party})</Heading>
		</Card>
	);
};
