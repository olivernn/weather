class BaseMapper
  def initialize(raw)
    @raw = raw
  end

  private

  attr_reader :raw
end
