json.array!(@locations) do |location|
  json.id location.id
  json.name location.name
  json.lat location.lat
  json.lng location.lng
end
