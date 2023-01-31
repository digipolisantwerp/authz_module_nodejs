/// <reference types="node" />
declare module "@digipolis/authz" {
	export type Source = "authzv2" | "meauthz" | "meauthzv2" | "externalAuthz";
	export interface BaseConfig {
		debug?: boolean;
		disabled?: boolean;
		cache?: boolean;
		tokenLocation?: string;
		source: Source;
		sources: {
			externalAuthz?: Function;
			url?: string;
			apiKey?: string;
			applicationId?: string;
		};
	}

	export interface Config extends BaseConfig {
		debug: boolean;
		set: boolean;
		disabled: boolean;
		tokenLocation: string;
		cache: boolean;
	}

	function checkOneOfPermissions(
		authToken: string,
		requiredPermissions?: string | string[],
		requestedsource?: Source
	): void;
	function checkPermission(
		authToken: string,
		requiredPermissions?: string | string[],
		requestedsource?: Source
	): void;
	function config(config: BaseConfig, force?: boolean): Config;
	function getConfig(): Config;
	function getPermissions(authToken: string, datasource: Source): string[];
	function hasOneOfPermissions(
		requiredPermissions: string | string[],
		source: Source
	): Promise<void>;
	function hasPermission(
		requiredPermissions: string | string[],
		source: Source
	): Promise<void>;
	function hasPermissions(
		requiredPermissions: string | string[],
		source: Source
	): Promise<void>;

	export = {
		checkOneOfPermissions,
		checkPermission,
		config,
		getConfig,
		getPermissions,
		hasOneOfPermissions,
		hasPermission,
		hasPermissions,
	};
}
