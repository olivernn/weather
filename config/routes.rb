Weather::Application.routes.draw do
  resource :map, only: :show

  root to: 'maps#show'
end
