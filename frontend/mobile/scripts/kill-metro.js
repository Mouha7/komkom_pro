const { execSync } = require("node:child_process");

function getPidsForPort(port) {
	try {
		const output = execSync(`lsof -ti tcp:${port}`, {
			stdio: ["ignore", "pipe", "ignore"],
			encoding: "utf8",
		}).trim();

		if (!output) {
			return [];
		}

		return output
			.split("\n")
			.map((pid) => pid.trim())
			.filter(Boolean);
	} catch {
		return [];
	}
}

function killPid(pid) {
	try {
		process.kill(Number(pid), "SIGTERM");
		return true;
	} catch {
		return false;
	}
}

const ports = [8081, 8082];
let killed = 0;

for (const port of ports) {
	const pids = getPidsForPort(port);

	for (const pid of pids) {
		if (killPid(pid)) {
			killed += 1;
			console.log(`Killed process ${pid} on port ${port}`);
		}
	}
}

if (killed === 0) {
	console.log("No Metro process found on ports 8081/8082");
}
