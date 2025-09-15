require 'rails_helper'

  RSpec.describe 'shared/_footer.html.erb', type: :view do
    it 'renders footer with proper structure' do
      render

      expect(rendered).to have_css('footer.bg-light.mt-5.py-4')
      expect(rendered).to have_css('.container')
      expect(rendered).to have_css('.row')
      expect(rendered).to have_css('.col-md-6', count: 2)
    end

    it 'includes copyright with current year' do
      render
      expect(rendered).to include("&copy; 2025")
      expect(rendered).to include(I18n.t('application.name'))
    end

    it 'includes application description' do
      render

      expect(rendered).to include(I18n.t('application.description'))
    end

    it 'has proper responsive layout' do
      render

      expect(rendered).to have_css('.text-end')  # Right alignment on larger screens
      expect(rendered).to have_css('.text-muted') # Muted text color
    end
  end
