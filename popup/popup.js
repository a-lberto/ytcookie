const api = typeof browser !== 'undefined' ? browser : chrome;

document.getElementById('extract').addEventListener(
    'click',
    async () => {
        const status = document.getElementById('status');
        status.textContent = 'Extracting...';

        try {
            // Use a promise-based approach for both
            const getCookies = (details) => {
                return new Promise((resolve) => {
                    api.cookies.getAll(details, resolve);
                });
            };

            const cookies = await getCookies({ domain: ".youtube.com" });
            
            if (cookies.length === 0) {
                status.textContent = 'No YouTube cookies found.';
                return;
            }

            let netscapeFormat = "# Netscape HTTP Cookie File\n";
            netscapeFormat += "# This is a generated file! Do not edit.\n\n";

            for (const cookie of cookies) {
                const domain = cookie.domain;
                const flag = domain.startsWith('.') ? "TRUE" : "FALSE";
                const path = cookie.path;
                const secure = cookie.secure ? "TRUE" : "FALSE";
                const expiration = cookie.expirationDate ? Math.round(cookie.expirationDate) : 0;
                const name = cookie.name;
                const value = cookie.value;

                netscapeFormat += `${domain}\t${flag}\t${path}\t${secure}\t${expiration}\t${name}\t${value}\n`;
            }

            const blob = new Blob([netscapeFormat], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ytcookie.txt';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            status.textContent = 'Downloaded ytcookie.txt';
        } catch (error) {
            status.textContent = 'Error: ' + error.message;
            console.error(error);
        }
    }
);
