class ObservationsMapper < BaseMapper
  def to_a
    Array.wrap(raw["Period"]).map do |period|
      year, month, day = period["value"].split('-').map(&:to_i)

      Array.wrap(period["Rep"]).map do |rep|
        {
          date: DateTime.new(year, month, day, rep["$"].to_i / 60),
          temperature: rep.fetch('T', nil).try(:to_f),
          visibility: rep.fetch('V', nil).try(:to_i),
          wind_direction: rep.fetch('D', ''),
          wind_speed: rep.fetch('S', nil).try(:to_i),
          weather_type: rep.fetch('W', nil).try(:to_i),
          pressure: rep.fetch('P', nil).try(:to_i)
        }
      end
    end.flatten
  end
end
