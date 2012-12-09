class LocationMapper < BaseMapper
  def to_h
    {
      ref: fetch_int('i'),
      lat: fetch_float('lat'),
      lng: fetch_float('lon'),
      name: fetch_title('name'),
      country: fetch_title('country'),
      continent: fetch_title('continent'),
    }
  end

  private

  def fetch_float(key)
    raw.fetch(key).to_f
  end

  def fetch_int(key)
    raw.fetch(key).to_i
  end

  def fetch_title(key)
    raw.fetch(key).titleize
  end
end
