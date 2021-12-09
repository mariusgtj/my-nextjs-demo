// import { useEffect, useState } from 'react';  // We don't need this bcs we use getStaticProps()
import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb'; // Min 2.30.00 important concepts explained !!!
import MeetupList from '../components/meetups/MeetupList';


// --------- This is with getStaticProps() ------------
/**
 **/

function HomePage(props) { // Here, "props" are from getStaticProps()

    return (
        <Fragment>
            <Head>
                <title>NextJS Meetups</title>
                <meta 
                    name="description" 
                    content="Browse a huge list of highly active NextJS meetups!" 
                />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

// Attention! This works in the PAGES directory ONLY !!!
export async function getStaticProps() {
    // Fetch data from API, DB, fs...
   
    // Sources for Environment Variables: 
    // https://nextjs.org/docs/basic-features/environment-variables
    // https://vercel.com/docs/concepts/projects/environment-variables
    // env vars are set in development - .env.local - and in Vercel Project - see the link above.
    // Be aware: in dev, env vars are declared into a file made by me: .env.local

    const client = await MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kg7ic.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);

    const db = client.db();

    const meetupsCollection = db.collection(`${process.env.DB_NAME}`);

    const meetups = await meetupsCollection.find().toArray(); // Find all collections

    client.close();


    // We always need to return an object here in getStaticProps !!!
    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            })) 
            // meetups: meetups // see the error provided by the id object of every doc in the collection, which cannot be serialized !! For that reason we needed to map the obj.
            // meetups: DUMMY_MEETUPS // These "meetups" will set as props for HomePage component we are in.
        },
        revalidate: 1 // This page will automatically re-pre-generated on the server, after deployment, every 1 second (depending on the rate of data changings).
    };
}
// ------------------------------------------------------------------------


// // ------ With getServerSideProps() ->> an alternative to the getStaticProps() fcn ----------------------------------------------

// function HomePage(props) { // Here, "props" are from getServerSideProps()

//     return <MeetupList meetups={props.meetups} /> 
// }

// export async function getServerSideProps(context) {
//     const req = context.req; // we have access to the request object (to work with authentication, check session cookie);
//     const res = context.res; // we have access to the response object;

//     // Fetch data from API, FS, DB...

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }
// // ------------------------------------------------------------------------


// // ------ This is with useEffect(), as a normal behavior of the page ------
// /**
//  * 
//  * Minute 1:32:00 - arround this moment are explained key concepts about pre-rendering !!!
//  */

// function HomePage() {

//    const [loadedMeetups, setLoadedMeetups] = useState([]);

//     useEffect(() => {
//         // send a http request and fetch data
//         setLoadedMeetups(DUMMY_MEETUPS);
//     }, []);

//     return <MeetupList meetups={loadedMeetups} />
// }
// // ------------------------------------------------------------------------

// // ------------- Dummie data --------------------------
// const DUMMY_MEETUPS = [
//     {
//         id: 'm1',
//         title: 'A First Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Neues_Rathaus_und_Marienplatz_M%C3%BCnchen.jpg',
//         address: 'Some address 5, 12345 Some City',
//         description: 'This is a first meetup'
//     },
//     {
//         id: 'm2',
//         title: 'The Second Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Neues_Rathaus_und_Marienplatz_M%C3%BCnchen.jpg',
//         address: 'Some address 10, 12345 Some City',
//         description: 'This is a second meetup'
//     }
// ];

// function HomePage() {
//     return <MeetupList meetups={DUMMY_MEETUPS} />
// }

export default HomePage;