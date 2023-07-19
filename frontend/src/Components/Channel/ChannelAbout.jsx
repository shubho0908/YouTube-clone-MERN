import { useState, useEffect } from "react";

function ChannelAbout(prop) {
  const [Email, setEmail] = useState();
  const [description, setDescription] = useState();
  const [links, setLinks] = useState();
  const [joinedDate, setjoinedDate] = useState();
  const [TotalViews, setTotalViews] = useState();

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
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getabout/${Email}`
          );
          const { description, sociallinks, joining } = await response.json();
          setDescription(description);
          setLinks(sociallinks);
          console.log(sociallinks);
          setjoinedDate(joining);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(GetAboutData, 200);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const GetTotalViews = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/totalviews/${Email}`
          );
          const totalViews = await response.json();
          setTotalViews(totalViews);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(GetTotalViews, 200);

    return () => clearInterval(interval);
  }, [Email]);

  const joined = new Date(joinedDate);

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
          {joinedDate ? (
            <p style={{ fontSize: "15px" }}>
              {joined.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : (
            <p style={{ fontSize: "15px" }}>No data</p>
          )}
          <hr className="seperate-three seperate" />
          <p>{TotalViews && TotalViews.toLocaleString()} views</p>
          <hr className="seperate-three seperate" />
        </div>
      </div>
    </>
  );
}

export default ChannelAbout;
