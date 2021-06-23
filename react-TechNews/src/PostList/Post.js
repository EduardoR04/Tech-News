import React from "react";
import "./Post.css";

// This class defines the structure every post should have
class Post extends React.Component {
  constructor(props) {
    //boilerplate
    super(props);
    //hack to know about this
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  handleUpvote() {
    this.props.handleUpvote(this.props.id);
  }

  handleDownvote() {
    this.props.handleDownvote(this.props.id);
  }

  render() {
    //return JSX element
    return (
      <li>
        <span className="post-id">{this.props.id}.</span>
        {/* upvote button */}
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-triangle-fill"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.handleUpvote}
        >
          <path
            fill-rule="evenodd"
            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
          />
        </svg>
        {/* downvote button  */}
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-triangle-fill downvote"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.handleDownvote}
        >
          <path
            fill-rule="evenodd"
            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
          />
        </svg>
        {/* <button onClick={this.handleUpvote}>Upvote</button> */}
        {/* <button onClick={this.handleDownvote}>Downvote</button> */}

        <a href={this.props.url}>
          <span className="title">{this.props.title}</span>
        </a>

        <span className="url">({this.props.url})</span>

        <p className="points">{this.props.points} points</p>
      </li>
    );
  }
}

export default Post;
