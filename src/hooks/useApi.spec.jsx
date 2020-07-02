import React, { useContext } from "react";
import { cleanup, fireEvent, render, act } from "@testing-library/react";
import { Notification } from '../components/common/Notification';
import { useApi } from './useApi';
import axios from 'axios';
import { GlobalContextProvider } from "../contexts/GlobalContext";
import { NotificationContextProvider } from "../contexts/NotificationContext";

jest.mock('axios');

let api = null;

const Tester = ({ children }) =>
{
	api = useApi();

	return children;
};

const component = (
	<GlobalContextProvider>
		<NotificationContextProvider>
			<Tester>
				<Notification/>
			</Tester>
		</NotificationContextProvider>
	</GlobalContextProvider>
);


describe("The useApi hook", () =>
{
	afterEach(() =>
	{
		cleanup();
		axios.mockRestore();
	});

	it("get data from server", async (done) =>
	{
		const result = {};
		const options = {
			url: "/target",
			params: {
				value1: "abc",
				value2: 55
			}
		};

		const { container } = render(<>{component}</>);

		axios.mockImplementation((inputs) =>
		{
			try
			{
				expect(inputs.url).toBe(`/api/${options.url}`);
				expect(inputs.method).toBe("GET");
				expect(inputs.params.value1).toBe(options.params.value1);
				expect(inputs.params.value2).toBe(options.params.value2);
			}
			catch (err)
			{
				done(err);
			}
			return {
				data: {
					something: "unexpected"
				}
			};
		});

		await act(async () =>
		{
			result.get = await api.getData(options);
		});

		try
		{
			expect(result.get.something).toBe("unexpected");
		}
		catch (err)
		{
			done(err);
		}

		done();
	});

	it("post data to server", async (done) =>
	{
		const result = {};
		const options = {
			url: "/target",
			data: {
				value3: "abc",
				value4: 55
			}
		};

		const { container } = render(<>{component}</>);

		axios.mockImplementation((inputs) =>
		{
			try
			{
				expect(inputs.url).toBe(`/api/${options.url}`);
				expect(inputs.method).toBe("POST");
				expect(inputs.data.value3).toBe(options.data.value3);
				expect(inputs.data.value4).toBe(options.data.value4);
			}
			catch (err)
			{
				done(err);
			}
			return {
				data: {
					something: "unexpected"
				}
			};
		});

		await act(async () =>
		{
			result.post = await api.postData(options);
		});

		try
		{
			expect(result.post.something).toBe("unexpected");
		}
		catch (err)
		{
			done(err);
		}

		done();
	});

	it("handle error posting data to server", async (done) =>
	{
		const result = {};
		const options = {
			url: "/target",
			data: {
				value3: "abc",
				value4: 55
			}
		};

		const { container } = render(<>{component}</>);

		axios.mockImplementation((inputs) =>
		{
			try
			{
				expect(inputs.url).toBe(`/api/${options.url}`);
				expect(inputs.method).toBe("POST");
				expect(inputs.data.value3).toBe(options.data.value3);
				expect(inputs.data.value4).toBe(options.data.value4);
			}
			catch (err)
			{
				done(err);
			}

			throw new Error("something faled");
		});

		await act(async () =>
		{
			result.post = await api.postData(options);
		});

		try
		{
			const div = container.querySelector("div.message");
			expect(div).not.toBeNull();
			expect(div.textContent).toBe("Error: something faled");
		}
		catch (err)
		{
			done(err);
		}

		done();
	});

});
