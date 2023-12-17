import type { FunctionComponent } from "react";
import type { ContactRecord } from "../data";
import { Form, useLoaderData } from "@remix-run/react";
import { getContact } from "../data";
import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId params");

  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response("Contact does not exist", { status: 404 });
  }

  return json({ contact });
};

const Contact = () => {
  const { contact } = useLoaderData<typeof loader>();
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar:
  //     "https://plus.unsplash.com/premium_photo-1673967770669-91b5c2f2d0ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2l0dGVufGVufDB8fDB8fHww",
  //   x: "webdevtolu",
  //   notes: "i am great!",
  //   favorite: true,
  // };
  return (
    <div id="contact">
      <div>
        <img
          src={contact.avatar}
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
        />
      </div>
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>
        {contact.x ? (
          <p>
            <a href={`https://twitter.com/${contact.x}`} target="_blank">
              {contact.x}
            </a>
          </p>
        ) : null}
        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
