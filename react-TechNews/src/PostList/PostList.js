import React from "react";
import Post from "./Post";
import $ from "jquery";
import "./PostList.css";

class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleTextboxValue: "",
      urlTextboxValue: "",
      isLoaded: false,
      error: null,
      data: [],
    };

    this.handleAddButtonPress = this.handleAddButtonPress.bind(this);
    this.handleTitleTextboxChange = this.handleTitleTextboxChange.bind(this);
    this.handleUrlTextboxChange = this.handleUrlTextboxChange.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  componentDidMount() {
    //Part 1: Remove this hardcoded stuff and retrieve the data
    //from your Post API
    //- if loading succeeds make sure you set isLoaded to true in the state
    //- if loading fails set isLoaded to true AND error to true in the state

    $.ajax({
      url: "http://localhost:5000/posts",
      method: "get",
    })
      .done((json_result) => {
        this.setState((state) => {
          return { data: json_result, isLoaded: true };
        });
      })
      .fail((error) => {
        console.log(error);
        this.setState((state) => {
          return { isLoaded: true, error: true };
        });
      });
  }

  handleAddButtonPress() {
    //Part 2:
    //- Add the post to the API via AJAX call
    // -- if the call succeeds, add the copy of the post you receive from the API
    // to your local copy of the data
    // -- if an error occurs set error to true in the state
    let newData = this.state.data;
    newData.push({
      title: this.state.titleTextboxValue,
      url: this.state.urlTextboxValue,
    });

    this.setState(function (state) {
      return { data: newData };
    });

    $.ajax({
      url: "http://localhost:5000/posts",
      method: "post",
      data: {
        title: this.state.titleTextboxValue,
        url: this.state.urlTextboxValue,
        points: 0,
      },
    })
      .done(console.log("data successfully added"))
      .fail((error) => {
        console.log(error);
        this.setState((error) => {
          return { error: true };
        });
      });
  }

  handleTitleTextboxChange(event) {
    this.setState(function (state) {
      return { titleTextboxValue: event.target.value };
    });
  }

  handleUrlTextboxChange(event) {
    this.setState(function (state) {
      return { urlTextboxValue: event.target.value };
    });
  }

  handleUpvote(id) {
    //Part 3:
    //- Modify the local copy of the data
    //- Upvote the post on the server via API call
    //- if an error occurs set error to true in the state
    let newData = this.state.data;

    let foundIndex = -1;
    newData.forEach(function (post, index) {
      if (post.id === id) {
        foundIndex = index;
      }
    });

    if (foundIndex !== -1) {
      newData[foundIndex].points = newData[foundIndex].points + 1;

      this.setState(function (state) {
        return { data: newData };
      });
    }

    $.ajax({
      url: "http://localhost:5000/posts/upvote",
      method: "patch",
      data: {
        id: id,
      },
    })
      .done(console.log("Data successfully updated"))
      .fail((error) => {
        console.log(error);
        this.setState((error) => {
          return { error: true };
        });
      });
  }

  handleDownvote(id) {
    //Part 4:
    //- Modify the local copy of the data
    //- Downvote the post on the server via API call
    //- if an error occurs set error to true in the state
    let newData = this.state.data;

    let foundIndex = -1;
    newData.forEach(function (post, index) {
      if (post.id === id) {
        foundIndex = index;
      }
    });

    if (foundIndex !== -1) {
      if (newData[foundIndex].points !== 0) {
        newData[foundIndex].points = newData[foundIndex].points - 1;

        this.setState(function (state) {
          return { data: newData };
        });

        $.ajax({
          url: "http://localhost:5000/posts/downvote",
          method: "patch",
          data: {
            id: id,
          },
        })
          .done(console.log("Data successfully updated"))
          .fail((error) => {
            console.log(error);
            this.setState((error) => {
              return { error: true };
            });
          });
      } else {
        console.log("cannot go below 0");
      }
    }
  }

  render() {
    let error = this.state.error;
    let isLoaded = this.state.isLoaded;

    if (error) {
      return <div>Sorry, an error occurred.</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let handleUpvote = this.handleUpvote;
      let handleDownvote = this.handleDownvote;
      let todoList = this.state.data.map(function (post) {
        return (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            url={post.url}
            points={post.points}
            handleUpvote={handleUpvote}
            handleDownvote={handleDownvote}
          ></Post>
        );
      });

      return (
        <div>
          <h3 className="header">
            {" "}
            <span className="header-text">Tech News</span>
          </h3>
          {todoList}
          <div>
            <div className="panel panel-default">
              <div className="panel-heading">New Submission</div>
              <div className="panel-body">
                <span className="input-text">Title:</span>
                <input
                  type="text"
                  value={this.state.titleTextboxValue}
                  onChange={this.handleTitleTextboxChange}
                  className="input-box"
                ></input>
                <br />
                <span className="input-text">URL: </span>
                <input
                  type="text"
                  value={this.state.urlTextboxValue}
                  onChange={this.handleUrlTextboxChange}
                  className="input-box"
                ></input>
                <br />
                <button className="button" onClick={this.handleAddButtonPress}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default PostList;
