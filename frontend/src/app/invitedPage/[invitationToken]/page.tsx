import React from "react";
import { Metadata } from "next";
import "./page.css";

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const title = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Invitation ${params.invitationToken}`);
    }, 100);
  });

  return {
    title: `Invitation ${title}`,
  };
};

type Props = {
  params: {
    invitationToken: string;
  };
};

const InvitedPage = ({ params }: { params: { invitationToken: string } }) => {
  return (
    <div className="invitation-wrapper">
      <h1>Invited Page for token {params.invitationToken}</h1>
    </div>
  );
};

export default InvitedPage;
