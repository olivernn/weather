json.array!(@observations) do |observation|
  json.location_id observation.location_id
  json.date observation.date
  json.temperature observation.temperature
end
