import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import SocialPage from "../components/pages-components/SocialPage";
import AnnotationsPage from "../components/pages-components/AnnotationsPage";
import CollectionPage from "../components/pages-components/CollectionPage";
import ControlButton from "../components/footer-components/ControlButton";
import AddAnnotation from "../components/featured-components/AddAnnotation";
import LyricsContainer from "../components/featured-components/LyricsContainer";
import NavItem from "../components/sidebar-components/NavItem";
import AddComment from "../components/footer-components/AddComment";
import Comment from "../components/featured-components/Comment";
import Annotation from "../components/featured-components/Annotation";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";

/** TODO: At the moment, these tests don't really test against our actual code.
 * We should eventually make new components that are specifically kind of built on
 * top of existing components. I think this we make it easier to test against our code.
 *
 * For example, instead of importing a NavItem and recreating the social tab button,
 * I think we should make a social tab NavItem component.
 */

const axiosGetMock = jest.spyOn(axios, "get").mockImplementation(async () => ({
  message: "Made fake axios get request",
}));

const axiosPostMock = jest
  .spyOn(axios, "post")
  .mockImplementation(async () => ({
    message: "Made fake axios post request",
  }));

const closeTipCallbackMock = jest.fn();

const mocks = [axiosGetMock, axiosPostMock, closeTipCallbackMock];

beforeEach(() => {
  mocks.map((m) => m.mockClear());
});

afterAll(() => {
  mocks.map((m) => m.mockRestore());
});

test("test button for social tab", async () => {
  // Render the NavItem
  const { getByTestId } = render(
    <Router history={history}>
      <NavItem to="/social" exact={true} name="Social" label="Social" />
    </Router>
  );

  // Test that the social icon appears
  expect(screen.getByTestId("social-icon")).toBeTruthy();
});

test("test social page not logged in", async () => {
  // Render the NavItem
  render(
    <Router>
      <SocialPage />
    </Router>
  );

  // Since not logged in, social feed should not be displayed
  expect(screen.getByText("Log in to see Your Feed")).toBeTruthy();
});

test("test button for search tab", async () => {
  // Render the NavItem
  render(
    <Router>
      <NavItem to="/search" exact={true} name="Search" label="Search" />
    </Router>
  );

  // Test that the search icon appears
  expect(screen.getByTestId("search-icon")).toBeTruthy();
});

test("test comment button", async () => {
  const closeMock = jest.fn();
  const onClick = () => {
    render(<AddComment closeTip={closeMock} song_id={"foo"} token={"bar"} />);
  };

  // Render the comment button
  const { getByTitle } = render(
    <Router>
      <ControlButton
        title="Comment"
        icon="Comment"
        size="x-larger"
        onClick={onClick}
      />
    </Router>
  );

  // Click comment button and expect form to show up
  expect(screen.getByTitle("Comment")).toBeTruthy();
  fireEvent.click(getByTitle("Comment"));
  expect(screen.getByText("Add Comment")).toBeTruthy();

  // Test clicking submit
  expect(screen.getByText("Add")).toBeTruthy();
  fireEvent.click(screen.getByText("Add"));
  expect(axiosPostMock).toBeCalledTimes(1);
  expect(closeMock).toHaveBeenCalledTimes(1);

  // Test clicking cancel
  expect(screen.getByText("Cancel")).toBeTruthy();
  fireEvent.click(screen.getByText("Cancel"));
  expect(axiosPostMock).toBeCalledTimes(1);
  expect(closeMock).toHaveBeenCalledTimes(2);
});

test("test navigation to annotations page", async () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  // Recreate what actually happens when we click the annotations button
  const mockOnClick = jest.fn().mockImplementation(() => {
    history.push("/annotations");
  });
  
  // Render a button
  render(
    <ControlButton
      title="Annotations"
      icon="Annotation"
      size="x-larger"
      onClick={mockOnClick}
    />
  );
  // Check for elements on screen
  expect(screen.getByTitle("Annotations")).toBeTruthy();
  expect(screen.getByTestId("annotation-icon")).toBeTruthy();
  // Check that user interaction happens as expected
  fireEvent.click(screen.getByTitle("Annotations"));
  console.log(history.location.pathname);
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

test("test annotations page", async () => {
  // Render
  render(
    <Router>
      <AnnotationsPage />
    </Router>
  );

  // Expect that lyrics and annotations secitons will appear
  expect(screen.getByText("Lyrics:")).toBeTruthy();
  expect(screen.getByTestId("lyrics-body")).toBeTruthy();
  expect(screen.getByText("Comments")).toBeTruthy();
});

test("test collections page", async () => {
  // Render
  const { getByTestId } = render(
    <Router>
      <CollectionPage />
    </Router>
  );
  
  /* Nothing should show up except empty div because the test can't log us in.
  It may be worth trying to figure out how to login in a test. */
  expect(getByTestId("collection-page-content")).toBeTruthy();
});

test("test add annotation", async () => {
  // Setup user event
  const user = userEvent.setup();

  // Render
  const { getByText } = render(
    <Router>
      <AddAnnotation
        closeTip={closeTipCallbackMock}
        token={"foo"}
        annotatedText={"bar"}
      />
    </Router>
  );

  expect(screen.getByText("Add Comment")).toBeTruthy();
  expect(screen.getByText("Add")).toBeTruthy();
  expect(screen.getByText("Cancel")).toBeTruthy();

  fireEvent.click(getByText("Add"));
  // Clicking "Add" should trigger post to database
  expect(axiosPostMock).toHaveBeenCalled();
  expect(closeTipCallbackMock).toHaveBeenCalled();

  // Clicking "Cancel" should just close the form
  fireEvent.click(getByText("Cancel"));
  expect(axiosPostMock).toHaveBeenCalledTimes(1);
  expect(closeTipCallbackMock).toHaveBeenCalledTimes(2);
});

test("lyrics container test", () => {
  const openMock = jest.fn();
  const testLyrics = "foo bar baz";
  const { getByText } = render(
    <Router>
      <LyricsContainer lyrics={"foo bar baz"} selectionCallback={jest.fn()} openTip={openMock} />
    </Router>
  );
  
  expect(getByText("Lyrics:")).toBeTruthy();
  expect(getByText(testLyrics)).toBeTruthy();
});

test("annotation test", () => {
  const { getByText } = render(
    <Router>
      <Annotation user={"user"} time={"00:00"} timestamp={"123000"} songID={"ID"} annotatedText={"foo"} noteBody={"bar"} />
    </Router>
  );

  expect(getByText("user")).toBeTruthy();
  expect(getByText("00:00")).toBeTruthy();
  expect(getByText("@2:03")).toBeTruthy();
  expect(getByText("foo")).toBeTruthy();
  expect(getByText("bar")).toBeTruthy();
});

test("comment test", () => {
  const { getByText } = render(
    <Router>
      <Comment user={"user"} songID={"ID"} timestamp={"123000"} commentBody={"foo"} />
    </Router>
  );

  expect(getByText("user")).toBeTruthy();
  expect(getByText("@2:03")).toBeTruthy();
  expect(getByText("foo")).toBeTruthy();
});
