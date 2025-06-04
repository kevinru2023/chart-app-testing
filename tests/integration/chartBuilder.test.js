/**
 * @vitest-environment jsdom
 */

import { render, fireEvent, screen } from '@testing-library/svelte';
import ChartBuilderTestWrapper from '../../src/lib/components/ChartBuilderTestWrapper.svelte';
import {test, afterEach, expect, vi} from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from '@testing-library/svelte';
import * as chartUtils from '$lib/generateChart';//used to spy on generateChart()

afterEach(() => {
  cleanup();
});

//Test 1 adding values 
test('adds new input fields when "+" button is clicked', async () => {
  const { getAllByLabelText} = render(ChartBuilderTestWrapper); // render to have access to input fields

  // Get initial count of X and Y fields
  const xInputsBefore = getAllByLabelText(/^x$/i);
  const yInputsBefore = getAllByLabelText(/^y$/i);
  expect(xInputsBefore.length).toBe(1);
  expect(yInputsBefore.length).toBe(1);

  const addButton = screen.getByRole('button', { name: '+' });
  await fireEvent.click(addButton);

  const xInputsAfter = getAllByLabelText(/^x$/i);
  const yInputsAfter = getAllByLabelText(/^y$/i);
  expect(xInputsAfter.length).toBe(2);
  expect(yInputsAfter.length).toBe(2);
});

//Preserve existing values 
test('preserves existing values and adds new empty input fields on "+" click', async () => {
  const { getAllByLabelText } = render(ChartBuilderTestWrapper);

  // Find initial inputs
  let xInputs = getAllByLabelText(/^x$/i);
  let yInputs = getAllByLabelText(/^y$/i);
  expect(xInputs.length).toBe(1);
  expect(yInputs.length).toBe(1);

  // Type into initial inputs
  await fireEvent.input(xInputs[0], { target: { value: '5' } });
  await fireEvent.input(yInputs[0], { target: { value: '10' } });

  // Click "+" button to add a new pair
  const addBtn = screen.getByRole('button', { name: '+' });
  await fireEvent.click(addBtn);

  // Re-query all inputs after DOM update
  xInputs = getAllByLabelText(/^x$/i);
  yInputs = getAllByLabelText(/^y$/i);

  // Should now be 2 pairs
  expect(xInputs.length).toBe(2);
  expect(yInputs.length).toBe(2);

  // First pair should still contain the values
  expect(xInputs[0]).toHaveValue('5');
  expect(yInputs[0]).toHaveValue(10);

  // Second pair should be empty
  expect(xInputs[1]).toHaveValue('');
  expect(yInputs[1]).toHaveValue(null);
});


test('shows alert if chart is generated without axis labels or data', async () => {
  const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});//intercept calls to window.alert by spying, and replacing any alerts() with () => {} to prevent popup

  // Render the component
  const { getByRole } = render(ChartBuilderTestWrapper);

  // Click the "Generate Chart" button without filling anything
  const generateBtn = getByRole('button', { name: /generate chart/i });
  await fireEvent.click(generateBtn);

  // Assert alert was called
  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching("Error: No data specified!"));

  // Cleanup
  alertSpy.mockRestore();
});

test('clears all chart data when "Clear Chart Data" button is clicked', async () => {
  const { container } = render(ChartBuilderTestWrapper);

  // Get all input fields 
  const titleInput = await screen.findByLabelText(/chart title/i);
  const colorInput = await screen.findByLabelText(/color/i);
  const xLabelInput = await screen.findByLabelText(/^x label$/i);
  const yLabelInput = await screen.findByLabelText(/^y label$/i);

  // Fill in
  await fireEvent.input(titleInput, { target: { value: 'Test Chart' } });
  await fireEvent.input(colorInput, { target: { value: '#ff0000' } });
  await fireEvent.input(xLabelInput, { target: { value: 'X Axis' } });
  await fireEvent.input(yLabelInput, { target: { value: 'Y Axis' } });

  // add x/y values
  const addBtn = screen.getByRole('button', { name: '+' });
  await fireEvent.click(addBtn);
  await fireEvent.click(addBtn); // Add a third pair

  // Get all X/Y input fields
  const xInputs = screen.getAllByLabelText(/^x$/i);
  const yInputs = screen.getAllByLabelText(/^y$/i);

  // Fill in X/Y values
  await fireEvent.input(xInputs[0], { target: { value: '1' } });
  await fireEvent.input(yInputs[0], { target: { value: '2' } });
  await fireEvent.input(xInputs[1], { target: { value: '3' } });
  await fireEvent.input(yInputs[1], { target: { value: '4' } });
  await fireEvent.input(xInputs[2], { target: { value: '5' } });
  await fireEvent.input(yInputs[2], { target: { value: '6' } });

  // Verify initial state before clearing
  expect(titleInput).toHaveValue('Test Chart');
  expect(colorInput).toHaveValue('#ff0000');
  expect(xLabelInput).toHaveValue('X Axis');
  expect(yLabelInput).toHaveValue('Y Axis');
  expect(xInputs.length).toBe(3);
  expect(yInputs.length).toBe(3);

  // Clear the data using the clear button
  const clearBtn = screen.getByRole('button', { name: /Clear Chart Data/i });
  await fireEvent.click(clearBtn);

  // Re-query elements after clearing
  const remainingXInputs = screen.getAllByLabelText(/^x$/i);
  const remainingYInputs = screen.getAllByLabelText(/^y$/i);

  // Verify everything is cleared and reset
  expect(titleInput).toHaveValue('');
  expect(colorInput).toHaveValue('#f97316'); // Default color
  expect(xLabelInput).toHaveValue('');
  expect(yLabelInput).toHaveValue('');
  expect(remainingXInputs.length).toBe(1);
  expect(remainingYInputs.length).toBe(1);
  expect(remainingXInputs[0]).toHaveValue('');
  expect(remainingYInputs[0]).toHaveValue(null);
});


test('calls generateChart with correct user data', async () => {
  const spy = vi.spyOn(chartUtils, 'generateChart').mockResolvedValue({ imageData: 'fake-image-url' });//spy on chartUtils.generateChart to stub a fakeurl 

  render(ChartBuilderTestWrapper);


  await fireEvent.input(screen.getByLabelText(/chart title/i), {//Fill in information 
    target: { value: 'My Chart' }
  });
  await fireEvent.input(screen.getByLabelText(/^x label$/i), {
    target: { value: 'Time' }
  });
  await fireEvent.input(screen.getByLabelText(/^y label$/i), {
    target: { value: 'Speed' }
  });
  const xInputs = screen.getAllByLabelText(/^x$/i);
  const yInputs = screen.getAllByLabelText(/^y$/i);
  await fireEvent.input(xInputs[0], {
    target: { value: '1' }
  });
  await fireEvent.input(yInputs[0], {
    target: { value: '100' }
  });

  // Click the generate chart button
  await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));

  // Assert the spy was called
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
  'bar',
  [{ x: '1', y: 100 }],
  'Time',
  'Speed',
  'My Chart',
  "#F97316",
 );

  // Cleanup
  spy.mockRestore();
});