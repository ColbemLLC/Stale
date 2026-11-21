import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DynamicCodeBlock } from "./dynamic-code-block";

describe("DynamicCodeBlock", () => {
	it("renders plain code on the server", async () => {
		const stream = await renderToReadableStream(
			<DynamicCodeBlock
				lang="ts"
				code={'import { betterAuth } from "better-auth"'}
			/>,
		);
		const html = await new Response(stream).text();

		expect(html).toContain("betterAuth");
		expect(html).not.toContain("--shiki-light");
	});
});
