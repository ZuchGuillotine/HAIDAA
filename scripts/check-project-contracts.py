"""Offline checks for the deliberately limited project protocol export."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
load = lambda p: json.loads((ROOT / p).read_text())
command = load('schemas/project-agent-command.schema.json')
record = load('schemas/project-audit-record.schema.json')
constraints = load('schemas/project-agent-constraints.json')
example = load('examples/project-start-action.json')
assert set(command['properties']) == {'body', 'signature'}
body = command['properties']['body']
assert set(body['required']) == set(body['properties'])
actions = {a['properties']['operation']['const']: a
           for a in body['properties']['action']['oneOf']}
assert set(actions) == {'start', 'join', 'contribute', 'review'}
assert set(actions) == set(constraints['exported_operations'])
assert set(example) == set(actions['start']['required'])
for name, spec in actions['start']['properties'].items():
    value = example[name]
    assert isinstance(value, str)
    if 'const' in spec:
        assert value == spec['const']
    if 'enum' in spec:
        assert value in spec['enum']
    assert len(value) >= spec.get('minLength', 0)
    assert len(value) <= spec.get('maxLength', len(value))
assert set(record['properties']) == {
    'protocol', 'version', 'project_id', 'sequence', 'previous_hash',
    'command_id', 'accepted_at', 'server_key_id', 'verification_state', 'global_status'
}
assert record['properties']['sequence']['type'] == 'integer'
assert constraints['command_domain'] == 'HAIDAA-PROJECT-COMMAND-V1\n'
assert constraints['audit_record_domain'] == 'HAIDAA-PROJECT-RECORD-V1\n'
print('Project export: bounded action allowlist, fixture, record shape and byte domains pass')
