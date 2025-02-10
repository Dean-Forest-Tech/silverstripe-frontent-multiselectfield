<?php

namespace DFT\SilverStripe\FrontendMultiSelectField;

use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\ListboxField;
use SilverStripe\View\Requirements;

class FrontendMultiSelectField extends ListboxField
{
    /**
     * Should this field include required CSS and JS (disable if you
     * want to add these to your own bundles)
     *
     * @var bool
     */
    private static $require_client = true;

    /**
     * Creates a new dropdown field.
     *
     * @param string $name The field name
     * @param string $title The field title
     * @param array $source An map of the dropdown items
     * @param string|array|null $value You can pass an array of values or a single value like a drop down to be selected
     * @param int $size Optional size of the select element
     */
    public function __construct($name, $title = '', $source = [], $value = null, $size = null)
    {
        if ($size) {
            $this->setSize($size);
        }

        parent::__construct($name, $title, $source, $value);
    }

    public function Field($properties = [])
    {
        $add_extra = Config::inst()->get(
            self::class,
            'require_client'
        );

        if ($add_extra === true) {
            Requirements::javascript('silverstripe-frontent-multiselectfield:client/dist/bundle.js');
            Requirements::css('silverstripe-frontent-multiselectfield:client/dist/bundlecss.css');
        }

        parent::Field($properties);
    }
}