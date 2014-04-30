class ExamplesController < ApplicationController
  before_action :example, :only => [:show]

  def show

  end

  private

  def chapter
    @chapter ||= Chapter.find params[:chapter_id]
  end

  def example
    @example ||= Example.find params[:id]
    @example = nil if @example.chapter_d != chapter.id
  end

end
