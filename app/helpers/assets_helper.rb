module AssetsHelper
  def javascript_application_include_tag
    requirejs_include_tag 'application' do |controller|
      { 'main' => 'application' }
    end
  end
end
