require 'rails_helper'

  RSpec.describe 'shared/_header.html.erb', type: :view do
    it 'renders navigation bar with proper Bootstrap classes' do
      render

      expect(rendered).to have_css('nav.navbar.navbar-expand-lg.navbar-dark.bg-primary')
      expect(rendered).to have_css('.container')
      expect(rendered).to have_css('.navbar-brand')
      expect(rendered).to have_css('.navbar-toggler')
    end

    it 'includes application name as brand link' do
      render

      expect(rendered).to have_link(href: root_path)
      expect(rendered).to include(I18n.t('application.name'))
    end

    it 'has responsive navigation elements' do
      render

      expect(rendered).to have_css('.navbar-collapse')
      expect(rendered).to have_css('.navbar-nav')
      expect(rendered).to have_css('.nav-item')
      expect(rendered).to have_css('.nav-link')
    end
  end
