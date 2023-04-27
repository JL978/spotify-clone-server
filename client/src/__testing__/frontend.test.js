import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import AnnotationsPage from "../components/pages-components/AnnotationsPage";
import CollectionPage from "../components/pages-components/CollectionPage";
import ControlButton from "../components/footer-components/ControlButton";
import AddAnnotation from "../components/featured-components/AddAnnotation";
import NavItem from "../components/sidebar-components/NavItem";
import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'


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

const axiosPostMock = jest.spyOn(axios, "post").mockImplementation(async () => ({
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
  render(
    <Router>
      <NavItem to="/social" exact={true} name="Social" label="Social" />
    </Router>
  );

  // Test that the social icon appears
  expect(screen.getByTestId("social-icon")).toBeTruthy();
});


test("test button for search tab", async () => {
  // Render the NavItem
  render(
    <Router>
      <NavItem to="/search" exact={true} name="Search" label="Search" />
    </Router>
  );
});


// For testing stuff from lyrics branch once it's merged
test('test navigation to annotations page', async () => {
    const mockOnClick = jest.fn()
    // Render a button
    render(<ControlButton title='Annotations' icon='Annotation' size='x-larger' onClick={mockOnClick} />)
    // Check for elements on screen
    expect(screen.getByTitle('Annotations')).toBeTruthy()
    expect(screen.getByTestId('annotation-icon')).toBeTruthy()
    // Check that user interaction happens as expected
    fireEvent.click(screen.getByTitle('Annotations'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
}); 

test("test annotations page", async () => {
  // Render
  render(
    <Router>
      <AnnotationsPage/>
    </Router>
  );

  
  // Expect that lyrics and annotations secitons will appear
  expect(screen.getByText("Lyrics:")).toBeTruthy();
  expect(screen.getByTestId("lyrics-body")).toBeTruthy();
  expect(screen.getByText("Comments")).toBeTruthy();
});

test("test collections page", async () => {
  // Render
  render(
    <Router>
      <CollectionPage/>
    </Router>
  );

  
});

test("test add annotation", async () => {
  // Setup user event
  const user = userEvent.setup();

  // Render
  const { getByText } = render(
    <Router>
      <AddAnnotation closeTip={closeTipCallbackMock} token={'foo'} annotatedText={'bar'}/>
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
