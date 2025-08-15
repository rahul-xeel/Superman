import { useState } from 'react'
import './Middle.css'

function Middle() {

    const [api, setApi] = useState('');
    const [output, setOutput] = useState(["RESPONSE"]);
    const [method, setMethod] = useState('GET');
    const [loading, setLoading] = useState("SEND");
    const [disabled, setDisabled] = useState(false);
    const [inputBody, setInputBody] = useState('');

    const callApi = async () => {
        if (!api.trim()) {
            setOutput({ error: "Please enter an API URL before sending request." });
            return;
        }
        if (!api.toLowerCase().startsWith('http')) {
            setOutput({ error: "API must start with http or https." });
            return;
        }

        try {
            setDisabled(true);
            setLoading('Loading...');

            let options = { method };

            if (method !== 'GET' && method !== 'DELETE' && inputBody.trim() !== '') {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = inputBody;
            }

            const raw_data = await fetch(api, options);
            const text = await raw_data.text();

            let data;
            try {
                data = text ? JSON.parse(text) : { message: 'No content returned' };
            } catch {
                if (text.includes('<html') || text.includes('<!doctype html')) {
                    data = { error: "⚠ HTML returned instead of JSON. Check the API endpoint." };
                } else {
                    data = { raw: text || 'No content returned' };
                }
            }

            setOutput(data);

        } catch (error) {
            setOutput({ error: error.message });
        } finally {
            setLoading("SEND");
            setDisabled(false);
        }
    }

    return (
        <div id="Middle">

            <div id="Middle_A">
                <select id="Method_box" value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>

                <input
                    onChange={(event) => setApi(event.target.value)}
                    id="Api_Box"
                    value={api}
                    placeholder="https://jsonplaceholder.typicode.com/users"
                />

                <button onClick={callApi} id='Sendbtn' disabled={disabled}>
                    {loading}
                </button>
            </div>

            <div id="Middle_B">
                <textarea
                    placeholder={`INPUT BOX\n{\n    firstname: "rahul",\n    lastname: "kumar"\n}`}
                    value={inputBody}
                    onChange={(e) => setInputBody(e.target.value)}
                />
            </div>

            <div id="Middle_C">
                <textarea
                    value={JSON.stringify(output, null, 2)}
                    placeholder='RESPONSE'
                    readOnly
                />
            </div>
        </div>
    )
}

export default Middle;
