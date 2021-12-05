/**
 * The intention of this file is to show a single page based on the meetupId.
 * For this, we will use:
 * --- paths ->> to get all possible meetups' ids from the DB.
 * --- getstaticprops ->> to show the record with the id provided from the user as url param.
 * In the end, the main component in this file (<MeetupDetail />) will use as props the props provided by getStaticProps()!!
*/

import { MongoClient, ObjectId } from 'mongodb';  // ObjectId is for transforming the string to an object 
import { Fragment } from 'react';
import Head from 'next/head';
import MeetupDetail from '../../components/meetups/MeetupDetail';

// --- MAIN COMPONENT ---

// This  MeetupDetails() uses "props" from getStaticProps().--------------------
function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta 
                    name="description" 
                    content={props.meetupData.description} 
                />
            </Head>
            <MeetupDetail 
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

// // This MeetupDetails() is hard-coded.---------------
// function MeetupDetails() {
//     return (
//         <MeetupDetail 
//             image="https://upload.wikimedia.org/wikipedia/commons/6/62/Neues_Rathaus_und_Marienplatz_M%C3%BCnchen.jpg" 
//             title="First Meetup" 
//             address="Some Street 5, Some City" 
//             description="This is the first meetup" 
//         />
//     )
// }


// --- PATHS ---

// This fcn is needed if we use getStaticProps() !!
// We need to describe all the dynamic segments (pre-generate paths) for all the meetupId values that a user might be entering at the runtime.
export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://dbUser:dbUser2002@cluster0.kg7ic.azure.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1}).toArray(); // find->> first{}===noFilterCriteria (will give me all the meetups/documents==the collection), second {}===which fields do I need from every doument in the collection.

    client.close();

    return {
        fallback: false, // Means we have declared all the supported paths. If true, the app will generate a page for requested id, even if it is not in the paths array.

        // Now we generate the paths dinamically.
        // Be aware of writting map: ->> map(item => ({ object })) !!!
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } })),

        // // These are the hard-coded paths.
        // paths: [
        //     {
        //         params: {
        //             meetupId: 'm1',
        //         },
        //     },
        //     {
        //         params: {
        //             meetupId: 'm2',
        //         },
        //     },
        // ]
    };
}


// --- STATIC PROPS ---

export async function getStaticProps(context) {

    /**
     * !!! ATT:
     * Here was an error bcs the _id (object) generated by MongoDB, like this: SerializableError: Error serializing .data[0]returned from getServerSideProps in "/reports/[report]/[start]/[end]". Reason:object ("[object Object]") cannot be serialized as JSON. Please only return JSON serializable data types.
     * I solved with this: JSON.parse(JSON.stringify(data)) from this source: https://github.com/vercel/next.js/issues/11993
     */

    // Fetch data for a single meetup/record
    const meetupId = context.params.meetupId; 
    // "context" is available even to getStaticProps (but it won't hold the req and res objects). "meetupId" is the name we gave to the identifier we have between the square brackets ->> it is the name of the folder: /pages/[meetupId]. The concrete meetupId value is taken from the URL params.
    
    // console.log('meetupId is:', meetupId); // This will be seen on the serve-side console !!

    // Get one document from collection based upon the id (meetupId).
    const client = await MongoClient.connect('mongodb+srv://dbUser:dbUser2002@cluster0.kg7ic.azure.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    // // *** Using JSON.parse(JSON.stringify()) ***
    // const response = await meetupsCollection.findOne({_id: ObjectId(meetupId)}); 
    // const selectedMeetup = await JSON.parse(JSON.stringify(response)); // !!! ok
    // // ******************************************

    // // *** Without JSON.parse(JSON.stringify()) ***
    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)}); 

    // // ******************************************

    // console.log('selectedMeetup is:', selectedMeetup);

    client.close();

    return {

        // // Convert the field "_id" of "selectedMeetup" from object to string to avoid the serialization error. For that, we will set "meetupData" to an object:
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                image: selectedMeetup.image,
                title: selectedMeetup.title, 
                address: selectedMeetup.address, 
                description: selectedMeetup.description
            }
        }

        // // This is together with the JSON.parse(JSON.stringify())
        // props: {
        //     meetupData: selectedMeetup,
        // }

        // // Hard-coded:
        // props: {
        //     meetupData: {
        //         image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Neues_Rathaus_und_Marienplatz_M%C3%BCnchen.jpg',
        //         id: meetupId,
        //         title: 'First Meetup', 
        //         address: 'Some Street 5, Some City', 
        //         description: 'This is the first meetup'
        //     }
        // }

    }
}

export default MeetupDetails;