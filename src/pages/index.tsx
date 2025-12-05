import Head from 'next/head';
import { tss } from 'tss-react';
import { api } from '~/utils/api';

export default function Home() {
	const hello = api.post.hello.useQuery({ text: 'from tRPC' });
	const { classes } = useStyles();

	return (
		<>
			<Head>
				<title>DITND - Accueil</title>
			</Head>
			<div className={classes.main}></div>
		</>
	);
}

const useStyles = tss.withName(Home.name).create({
	main: {},
});
