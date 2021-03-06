import React, { Component } from "react";
import { withAuth } from "../../lib/AuthProvider";
import axios from "axios";
import "./MyReviews.css";

import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

class MyReviews extends Component {
  state = {
    allReviews: [], //All the reviews
    reviewsToShow: [], //Reviews of the user we need to show
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/review`)
      .then((reviews) => {
        const allReviews = reviews.data;
        const thisUserId = this.props.user._id;

        let thisUserReviews = allReviews.filter((eachReview) =>
          eachReview.user._id.includes(thisUserId)
        );

        this.setState({
          allReviews: reviews.data,
          reviewsToShow: thisUserReviews,
        });
      })
      .catch((err) => console.log(err));
  }

  removeComment(e, reviewId) {
    const id = reviewId;

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/review/delete`, { id })
      .then(() => this.componentDidMount())
      .catch((err) => console.log("Error while removing comment", err));
  }

  render() {
    const { reviewsToShow } = this.state;

    return (
      <div>
        {reviewsToShow.map((oneReview, index) => {
          const dateOfCreation = new Date(oneReview.createdAt);
          const year = dateOfCreation.getFullYear();
          const month = dateOfCreation.getMonth() + 1;
          const day = dateOfCreation.getDate();
          const hour = dateOfCreation.getHours();
          const minutes = dateOfCreation.getMinutes();

          return (
            <div className="my-reviews-container" key={index}>
              <div className="profile-pic-container">
                <img
                  style={{ marginBottom: "1em" }}
                  className="profile-pic-videogame-details"
                  src={`https://avatars.dicebear.com/v2/${oneReview.user.gender}/${oneReview.user.username}.svg?options[padding]=0.4&options[background]=%2300ff99`}
                  alt="profile-pic"
                />
              </div>
              <div className="vg-detail-review-container">
                <p>
                  {day}/{month}/{year}, at {hour}:{minutes}:
                </p>
                <p>{oneReview.review}</p>

                <Link to={`/videogames/${oneReview.videogameId}`}>
                  <Button
                    className="margin-buttons-marketplace"
                    variant="danger"
                  >
                    {oneReview.videogameName}
                  </Button>
                </Link>
              </div>

              <img
                onClick={(e) => this.removeComment(e, oneReview._id)}
                id="close-icon"
                className="close-icon"
                src={"../../../images/close-icon-grey.svg"}
                alt="close"
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default withAuth(MyReviews);
