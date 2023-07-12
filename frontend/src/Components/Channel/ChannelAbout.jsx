import { useState, useEffect } from "react";

function ChannelAbout(prop) {
  const [Email, setEmail] = useState();
  const [description, setDescription] = useState();
  const [links, setLinks] = useState();

  useEffect(() => {
    const getUserMail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getotherchannel/${prop.channelid}`
        );
        const userEmail = await response.json();
        setEmail(userEmail);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getUserMail, 200);

    return () => clearInterval(interval);
  }, [prop.channelid]);

  useEffect(() => {
    const GetAboutData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getabout/${Email}`);
        const { description, sociallinks } = await response.json();
        setDescription(description);
        setLinks(sociallinks);
        console.log(sociallinks);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(GetAboutData, 200);

    return () => clearInterval(interval);
  }, [Email]);

  return (
    <>
      <div className="channel-about-section">
        <div className="left-about-section">
          <div className="channel-description-section">
            <p>Description</p>
            <p className="channel-desc">{description && description}</p>
          </div>
          <hr className="seperate-two seperate" />

          <div className="channel-details">
            <p>Details</p>
            <div className="enquiries">
              <p>For business inquiries:</p>
              <a className="channel-email" href={`mailto:${Email}`}>
                {Email && Email}
              </a>
            </div>
          </div>
          <hr className="seperate-two seperate" />

          <div className="channel-links">
            <p>Links</p>
            <div className="channel-links-all">
              {links &&
                links.map((element, index) => {
                  return (
                    <div className="main-links" key={index}>
                      {element.instagram ? (
                        <a
                          href={`${element.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Instagram
                        </a>
                      ) : (
                        ""
                      )}

                      {element.facebook ? (
                        <a
                          href={`${element.facebook}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Facebook
                        </a>
                      ) : (
                        ""
                      )}
                      {element.twitter ? (
                        <a
                          href={`${element.twitter}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Twitter
                        </a>
                      ) : (
                        ""
                      )}
                      {element.website ? (
                        <a
                          href={`${element.website}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Website
                        </a>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="right-about-section">
          <p>Stats</p>
          <hr className="seperate-three seperate" />
          <p style={{ fontSize: "15px" }}>Joined Aug 11, 2020</p>
          <hr className="seperate-three seperate" />
          <p>3,52,544 views</p>
          <hr className="seperate-three seperate" />
        </div>
      </div>
    </>
  );
}

export default ChannelAbout;
