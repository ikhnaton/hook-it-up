import React, { useState } from 'react';
import axios from 'axios';
import get from 'lodash/get';

export const useApi = ({ headers = {}, baseUri = "" }) =>
{
	const [
		isLoading,
		setIsLoading
	] = useState(false);

	const [
		isError,
		setIsError
	] = useState(false);

	const [
		error,
		setError
	] = useState(null);

	const invoke = async ({ apiOptions, api }) =>
	{
		setIsLoading(true);
		try
		{
			const req = {
				...apiOptions,
				url: `${baseUri}${api}`,
				headers: {
					...headers,
					...apiOptions.headers
				}
			};

			const result = await axios(req);
			setIsLoading(false);
			return get(result, "data");
		}
		catch (err)
		{
			setIsLoading(false);
			setIsError(true);
			setError(get(err, "response.data.message", get(err, "response.statusText", err.toString())));

			return { result: null };
		}
	};

	const getData = async ({ url, params }) =>
	{
		const apiOptions = {
			method: "GET",
			params
		};

		return invoke({
			apiOptions,
			api: url
		});
	};

	const postData = async ({ url, data }) =>
	{
		const apiOptions = {
			method: "POST",
			data
		};

		return invoke({
			apiOptions,
			api: url
		});
	};

	return { getData, postData, isLoading, error, isError };
};
