import React, { useState } from 'react';
import { Button, Box, Flex, Card, Heading } from 'rebass';

export const CongressmanCard = ({ person }) => {
	const { last_name, first_name, party, phone } = person;
	const firstName = first_name;
	const lastName = last_name;
	const isAMale = person.gender === 'M';
	const isASenator = !person.district;
	const district = person.district;

	const detailContent = isASenator
		? `${isAMale ? 'He' : 'She'} is a senator of ${person.state}`
		: `${isAMale
				? 'He'
				: 'She'} is a representative for district ${district}, and has been in congress for ${person.seniority} years. ${isAMale
				? 'His'
				: 'Her'} next election is ${person.next_election}.`;

	const [ isExpanded, setIsExpanded ] = useState(false);

	const hasPhoneNumber = phone;
	const handleClick = () => {
		console.log('clicked');
		setIsExpanded(!isExpanded);
	};

	return (
		<Card
			width={256}
			sx={{ m: 'auto', mb: 2, bg: 'white', borderRadius: 10, p: 1, border: 'solid thin lightgrey' }}
		>
			<Flex>
				<Box sx={{ background: hasPhoneNumber ? '#8cff9c' : 'whitesmoke', borderRadius: 10 }} width={1 / 5}>
					{hasPhoneNumber ? (
						<a href={`tel:${phone}`} style={{ margin: '0 10px 0 10px' }}>
							<img
								src="https://img.icons8.com/ios/50/000000/phone.png"
								style={{ height: 20, width: 20 }}
							/>
						</a>
					) : (
						<div onClick={handleClick}>{isExpanded ? '-' : '+'}</div>
					)}
				</Box>
				<Box width={4 / 5} onClick={handleClick}>
					<Heading sx={{ fontSize: 2 }}>
						{firstName} {lastName} ({party})
					</Heading>
				</Box>
			</Flex>
			{isExpanded && (
				<div style={{ background: 'white', borderRadius: 10, marginTop: 10 }}>
					<Flex>
						<Box width={1/3} sx={{borderRadius:20 ,p:1, border:'thin black solid', margin: 2}}>FB</Box>
						<Box width={1/3} sx={{borderRadius:20 ,p:1, border:'thin black solid', margin: 2}}>TW</Box>
						<Box width={1/3} sx={{borderRadius:20 ,p:1, border:'thin black solid', margin: 2}}>URL</Box>
					</Flex>
					<div>{detailContent}</div>
				</div>

				
			)}
		</Card>
	);
};
